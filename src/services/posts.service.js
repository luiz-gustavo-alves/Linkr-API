import db from "../database/db.connection.js";
import hashtagService from "./hashtag.service.js";

const createPost = async (payload, hashtags, userID) => {

    const {
        description,
        URL,
    } = payload;

    const createdPost = await db.query(
        `INSERT INTO posts
            (description, "URL", "userID")
         VALUES
            ($1, $2, $3)
         RETURNING id;
        `, [description, URL, userID]
    );

    if (hashtags.length > 0) {
        const postID = createdPost.rows[0].id;
        hashtagService.createAndInsertHashtags(hashtags, postID);
    }
}

const checkUserPost = async (postID, userID) => {

    const result = await db.query(
        `SELECT * FROM posts
         WHERE id = $1 AND "userID" = $2
        `, [postID, userID]
    );

    return result;
}

const deletePost = async (postID, userID) => {

    const result = await checkUserPost(postID, userID);
    if (!result.rows[0]) {
        return;
    }

    hashtagService.deleteHashtags(postID);

    await db.query(
        `DELETE FROM posts
         WHERE id = $1 AND "userID" = $2
        `, [postID, userID]
    )
}


const postsService = {
    createPost,
    deletePost
}

export default postsService;