import db from "../database/db.connection.js";
import {
    checkHashtagsInDatabase,
    verifyNewHashtags,
    insertHashtagsFromPost
} from "../utils/hashtags/index.js";

const handleHashtags = async (hashtags, postID) => {

    const checkResult = checkHashtagsInDatabase(hashtags); 
    const queryResult = await db.query(checkResult.query, checkResult.queryParams);
    const hashtagIDs = queryResult.rows.map(queryResult => queryResult.id);

    const { newHashtags } = verifyNewHashtags(queryResult.rows, hashtags);
    if (newHashtags.length > 0) {

        for (let i = 0; i < newHashtags.length; i++) {

            const hashtag = newHashtags[i];
            const createdHashtag = await db.query(
                `INSERT INTO hashtags 
                    (hashtag)
                VALUES 
                    ($1)
                RETURNING id;
                `, [hashtag]
            );

            const hashtagID = createdHashtag.rows[0].id;
            hashtagIDs.push(hashtagID);
        }
    }

    const insertQueryResult = insertHashtagsFromPost(hashtagIDs, postID);
    await db.query(insertQueryResult.query, insertQueryResult.queryParams);
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
        postsService.handleHashtags(hashtags, postID);
    }
}


const postsService = {
    handleHashtags,
    createPost,
}

export default postsService;