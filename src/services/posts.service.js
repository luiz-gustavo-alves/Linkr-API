import db from "../database/db.connection.js";
import hashtagsService from "./hashtags.service.js";

const checkUserPost = async (postID, userID) => {

    const result = await db.query(
        `SELECT * FROM posts
         WHERE id = $1 AND "userID" = $2;
        `, [postID, userID]
    );

    return result;
}

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
        hashtagsService.createAndInsertHashtags(hashtags, postID);
    }
}

const deletePost = async (postID, userID) => {

    const result = await checkUserPost(postID, userID);
    if (!result.rows[0]) {
        return;
    }

    const resultHashtagPost = await hashtagsService.getHashtagsByPost(postID);
    if (resultHashtagPost.rows.length > 0) {
        hashtagsService.deleteHashtags(resultHashtagPost, postID);
    }

    await db.query(
        `DELETE FROM posts
         WHERE id = $1 AND "userID" = $2;
        `, [postID, userID]
    );
}

const updatePost = async (payload, hashtags, postID, userID) => {
    
    const result = await checkUserPost(postID, userID);
    if (!result.rows[0]) {
        return;
    }

    const resultHashtagPost = await hashtagsService.getHashtagsByPost(postID);
    if (resultHashtagPost.rows.length > 0) {
        hashtagsService.deleteHashtags(resultHashtagPost, postID);
    }

    const {
        description,
        URL,
    } = payload;

    await db.query(
        `UPDATE posts SET
            description = $1,
            "URL" = $2,
            "userID" = $3
         WHERE id = $4
        `, [description, URL, userID, postID]
    );

    if (hashtags.length > 0) {
        hashtagsService.createAndInsertHashtags(hashtags, postID);
    }
}


const postsService = {
    checkUserPost,
    createPost,
    deletePost,
    updatePost
}

export default postsService;