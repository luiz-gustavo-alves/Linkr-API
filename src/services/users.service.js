import db from "../database/db.connection.js";

const getTimelinePosts = async (offset) => {

    if (!offset) {
        offset = 0;
    }

    const currentOffset = 20 * offset;
    const posts = await db.query(
        `SELECT t1.*, t2.name, t2."imageURL"
         FROM
            (SELECT posts.*, COUNT(likes.*) AS "likesCount"
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

    return posts;
}

const usersService = {
    getTimelinePosts
}

export default usersService;