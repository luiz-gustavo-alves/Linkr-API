import db from '../database/db.connection.js'

const getTimelinePosts = async (offset, userID) => {
   if (!offset) {
      offset = 0
   }

   const currentOffset = 20 * offset
   const posts = await db.query(
      `SELECT p."id" AS "postID", p."description", p."URL", p."URL_title", p."URL_description", p."URL_image",
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
            ) AS "lastLikes"
            FROM "posts" p
            JOIN "users" u ON p."userID" = u."id"
            ORDER BY p."createdAt" DESC
            LIMIT 20 OFFSET $1;
        `,
      [currentOffset]
   )

   const postsList = posts.rows.map((post) => {
      const likesCount = post.lastLikes.length
      const postOwner = userID === post.user.id ? true : false
      return {
         postID: post.postID,
         description: post.description,
         URL: post.URL,
         URL_title: post.URL_title,
         URL_description: post.URL_description,
         URL_image: post.URL_image,
         user: {
            id: post.user.id,
            name: post.user.name,
            img: post.user.img
         },
         createdAt: post.createdAt,
         likes: likesCount,
         lastLikes: post.lastLikes,
         postOwner: postOwner
      }
   })

   return postsList
}

async function userPosts(id) {
   const result = await db.query(
      `
    SELECT p."id" AS "postID", p."description", p."URL", p."URL_title", p."URL_description", p."URL_image",
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
    COALESCE(l."likes_count", 0) AS "likes" -- Adicionando o campo "likes"
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

   return result
}

const postLike = async ({ userID, postID }) => {
   const liked = await db.query(`SELECT id FROM likes WHERE "userID" = $1 AND "postID" = $2`, [
      userID,
      postID
   ])

   if (liked.rows[0]) {
      await db.query(`DELETE FROM likes WHERE id = $1`, [liked.rows[0].id])
      return { liked: false }
   }

   await db.query(`INSERT INTO likes ("userID", "postID") VALUES ($1, $2)`, [userID, postID])

   return { liked: true }
}

const getUsersBySearch = async (query) => {

    const result = await db.query(`SELECT u.id, u.name, u."imageURL" FROM users as u WHERE name ILIKE $1 LIMIT 2`,
    [`${query}%`])

   return { liked: true }
}

const follow = async ({following, follower}) => {
    const followed = await db.query(`SELECT id FROM follows WHERE "userID_following" = $1 AND "userID_follower" = $2`, [
        following,
        follower
    ]);
  
     if (followed.rows[0]) {
        await db.query(`DELETE FROM follows WHERE "userID_following" = $1 AND "userID_follower" = $2`, [
            following,
            follower
        ])
        return { followed: false }
     };
  
     await db.query(`INSERT INTO follows ("userID_following", "userID_follower") VALUES ($1, $2)`, [following, follower]);
  
     return { followed: true };
}

const usersService = {
   getTimelinePosts,
   userPosts,
   getUsersBySearch,
   getUsersBySearch,
   postLike,
   follow
}

export default usersService
