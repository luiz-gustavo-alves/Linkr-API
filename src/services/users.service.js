import db from "../database/db.connection.js";

const getTimelinePosts = async (offset, userID) => {

    if (!offset) {
        offset = 0;
    }

    const currentOffset = 20 * offset;
    const posts = await db.query(
        `SELECT t1.*, t2.name, t2."imageURL"
         FROM
            (SELECT posts.*, COUNT(likes.*) AS "likes"
                FROM posts
                LEFT JOIN likes
                ON likes.id = posts.id
                GROUP BY posts.id
            ) AS t1
         JOIN
            (SELECT posts.id, users.name, users."imageURL"
                FROM posts
                JOIN users
                ON posts."userID" = users.id
                GROUP BY posts.id, users.id
            ) AS t2
         ON (t1.id = t2.id)
            ORDER BY t1.id DESC
            LIMIT 20 OFFSET $1;
        `, [currentOffset]
    );

    const postsList = posts.rows.map(post => {

        const postOwner = (userID === post.userID) ? true : false;
        return {
            "postID": post.id,
            "description": post.description,
            "URL": post.URL,
            "URL_title": post.URL_title,
            "URL_description": post.URL_description,
            "URL_image": post.URL_image,
            "user": {
                "id": post.userID,
                "name": post.name,
                "img": post.imageURL
            },
            "createdAt": post.createdAt,
            "likes": Number(post.likes),
            postOwner: postOwner
        }
    });

    return postsList;
}

async function userPosts(id){
    const result = await db.query(`
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
    ) AS "lastLikes"
    FROM "posts" p
    JOIN "users" u ON p."userID" = u."id"
    WHERE u."id" = $1
    ORDER BY p."createdAt" DESC;
    `, [id]);

    return result;
}

const getUsersBySearch = async (query) => {

    const result = await db.query(`SELECT u.id, u.name, u."imageURL" FROM users as u WHERE name ILIKE $1 LIMIT 2`,
    [`${query}%`])

    return result;
}

const usersService = {
    getTimelinePosts,
    userPosts,
    getUsersBySearch
}

export default usersService;

