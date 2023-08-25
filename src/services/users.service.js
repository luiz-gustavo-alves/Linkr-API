import db from '../database/db.connection.js'

const countFollowing = async (userID) => {
   
   const counter = await db.query(
      `SELECT COUNT(*) 
       FROM follows 
       WHERE "userID_following" = $1`
      , [userID]
   );

   return Number(counter.rows[0].count);
}

const countTimelinePosts = async (userID) => {

   const following = await db.query(`SELECT * FROM follows WHERE "userID_following" = $1`, [userID]);

   let followingIDs = following.rows.map(row => row.userID_follower);
   followingIDs.push(userID);

   const counter = await db.query(
      `SELECT COUNT(*)
         FROM posts
         WHERE posts."userID" = ANY($1);
      `, [followingIDs]
   );

   return Number(counter.rows[0].count)
}

const getTimelinePosts = async (limit, userID) => {

   const following = await db.query(`SELECT * FROM follows WHERE "userID_following" = $1`, [userID]);

   let followingIDs = following.rows.map(row => row.userID_follower);
   followingIDs.push(userID);

   const posts = await db.query(
      `SELECT p."id" AS "postID", p."description", p."URL", p."URL_title", p."URL_description", p."URL_image", p."createdAt",
             json_build_object('id', u."id", 'name', u."name", 'img', u."imageURL") AS "user",
             CAST(CASE WHEN p."userID" = $1 THEN 1 ELSE 0 END AS BIT) AS "postOwner",
             (
                SELECT COALESCE(array_agg(u2."name") FILTER (WHERE u2."name" IS NOT NULL), ARRAY[]::VARCHAR[])
                FROM (
                   SELECT "userID"
                   FROM "likes" l2
                   WHERE l2."postID" = p."id"
                   ORDER BY l2."id" DESC
                   LIMIT 3
                ) l3
                JOIN "users" u2 ON l3."userID" = u2."id"
             ) AS "lastLikes",
             COALESCE(l."likes_count", 0) AS "likes",
             COALESCE(
               (
                   SELECT array_agg(l4."userID")
                   FROM "likes" l4
                   WHERE l4."postID" = p."id"
               ),
               ARRAY[]::INTEGER[]
               ) AS "allLikedUserIDs"
       FROM "posts" p
       JOIN "users" u ON p."userID" = u."id"
       LEFT JOIN (
          SELECT "postID", COUNT(*) AS "likes_count"
          FROM "likes"
          GROUP BY "postID"
       ) l ON p."id" = l."postID"
       WHERE p."userID" = ANY($2)
       ORDER BY p."createdAt" DESC
       LIMIT $3
      `,
      [userID, followingIDs, limit]
    );
    
    return posts.rows;
}

async function userPosts(id) {

   const result = await db.query(
      `
    SELECT p."id" AS "postID", p."description", p."URL", p."URL_title", p."URL_description", p."URL_image", p."createdAt",
    json_build_object('id', u."id", 'name', u."name", 'img', u."imageURL") AS "user",
    (
        SELECT COALESCE(array_agg(u2."name") FILTER (WHERE u2."name" IS NOT NULL), ARRAY[]::VARCHAR[])
        FROM (
            SELECT "userID"
            FROM "likes" l2
            WHERE l2."postID" = p."id"
            ORDER BY l2."id" DESC
            LIMIT 3
        ) l3
        JOIN "users" u2 ON l3."userID" = u2."id"
    ) AS "lastLikes",
    COALESCE(l."likes_count", 0) AS "likes",
    COALESCE(
      (
          SELECT array_agg(l4."userID")
          FROM "likes" l4
          WHERE l4."postID" = p."id"
      ),
      ARRAY[]::INTEGER[]
      ) AS "allLikedUserIDs"
    FROM "posts" p
    JOIN "users" u ON p."userID" = u."id"
    LEFT JOIN (
        SELECT "postID", COUNT(*) AS "likes_count"
        FROM "likes"
        GROUP BY "postID"
    ) l ON p."id" = l."postID"
    WHERE u."id" = $1
    ORDER BY p."createdAt" DESC;

    `,
      [id]
   )

   if (result.rows.length === 0) {
      const newResult = await db.query(
         `SELECT * FROM users
            FROM users
            WHERE id = $1;
         `, [id]
      );

      const user = 
   }

   return result
}

const getUsersBySearch = async (query, userID) => {
   const result = await db.query(
      `SELECT DISTINCT
      u.id,
      u.name,
      u."imageURL",
      CASE WHEN f."userID_follower" IS NOT NULL THEN true ELSE false END as "isFollower"
  FROM
      users u
  LEFT JOIN
      follows f ON u.id = f."userID_follower" AND f."userID_following" = $1
  WHERE
      u.name ILIKE $2
  ORDER BY
      "isFollower" DESC
  LIMIT 2;
  
  
  `,
      [userID, `${query}%`]
   )

   return result
}

const postLike = async ({ userID, postID }) => {
   const liked = await db.query(`SELECT id FROM likes WHERE "userID" = $1 AND "postID" = $2`, [
      userID,
      postID
   ])

   if (liked.rows[0]) {
      await db.query(`DELETE FROM likes WHERE id = $1`, [liked.rows[0].id])

      const currentLikes = await db.query(`SELECT "postID" FROM likes WHERE "postID" = $1`, [
         postID
      ])

      return { liked: false, currentLikes: currentLikes.rowCount }
   }

   await db.query(`INSERT INTO likes ("userID", "postID") VALUES ($1, $2)`, [userID, postID])

   const currentLikes = await db.query(`SELECT "postID" FROM likes WHERE "postID" = $1`, [postID])

   return { liked: true, currentLikes: currentLikes.rowCount }
}

const follow = async (following, follower) => {
   const followed = await db.query(
      `SELECT * FROM follows WHERE "userID_following" = $1 AND "userID_follower" = $2`,
      [following, follower]
   )

   if (followed.rows[0]) {
      await db.query(
         `DELETE FROM follows WHERE "userID_following" = $1 AND "userID_follower" = $2`,
         [following, follower]
      )
      return { followed: false }
   }

   await db.query(`INSERT INTO follows ("userID_following", "userID_follower") VALUES ($1, $2)`, [
      following,
      follower
   ])

   return { followed: true }
}

const followCheck = async (following, follower) => {
   const followed = await db.query(
      `SELECT * FROM follows WHERE "userID_following" = $1 AND "userID_follower" = $2`,
      [following, follower]
   )
   if (followed.rows[0]) {
      return { followed: true }
   }
   return { followed: false }
}

const createComment = async (userID_owner, userID_comment, postID, comment) => {

   const result = await db.query(`
      INSERT INTO comments ("userID_owner", "userID_comment", "postID", "comment") 
      VALUES ($1, $2, $3, $4)
      RETURNING id;`, 
      [userID_owner, userID_comment, postID, comment]);
 
   return result;

}

const getAllComments = async () => {
   const result = await db.query(`
   SELECT c."id" AS "commentID", c."userID_owner", c."postID", c."comment", c."createdAt",
   json_build_object('id', uc."id", 'name', uc."name", 'img', uc."imageURL") AS "user"
   FROM "comments" c
   JOIN "users" uc ON c."userID_comment" = uc."id"
   `);
 
   return result.rows;
}

const usersService = {
   countFollowing,
   countTimelinePosts,
   getTimelinePosts,
   userPosts,
   getUsersBySearch,
   postLike,
   follow,
   followCheck,
   createComment,
   getAllComments
}

export default usersService
