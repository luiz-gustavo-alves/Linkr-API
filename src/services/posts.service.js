import db from "../database/db.connection.js";
import hashtagsService from "./hashtags.service.js";
import getMetaData from "metadata-scraper";

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

    const res = await getMetaData(URL);
    if (!res.description) {
        res.description = "";
    }

    if (!res.image) {
        res.image = "";
    }

    const createdPost = await db.query(
        `INSERT INTO posts
            (description, "userID", "URL", "URL_title", "URL_description", "URL_image")
         VALUES
            ($1, $2, $3, $4, $5, $6)
         RETURNING id;
        `, [description, userID, URL, res.title, res.description, res.image]
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

    await db.query(`DELETE FROM resposts WHERE postID = $1;`, [postID]);
    await db.query(`DELETE FROM likes WHERE postID = $1;`, [postID]);
    await db.query(`DELETE FROM comments WHERE postID = $1;`, [postID]);

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