import db from "../database/db.connection.js";

async function userPosts(id){
    const result = await db.query(`
    SELECT p."id", p."description", p."URL",
    json_build_object('id', u."id", 'name', u."name", 'img', u."imageURL") AS "user"
    FROM "posts" p
    JOIN "users" u ON p."userID" = u."id"
    WHERE u."id" = $1
    ORDER BY p."createdAt" DESC;
    `, [id]);
    return result;
}

const usersService = {
    userPosts
}

export default usersService;

