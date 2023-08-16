import db from "../database/db.connection.js";
import {
    getHashtagsInDatabase,
    verifyNewHashtags,
    insertHashtagsFromPost,
    deleteHastagsInDatabase
} from "../utils/hashtags/index.js";

const getHashtagsByPost = async (postID) => {

    const resultHashtagPost = await db.query(
        `SELECT * FROM "hashtagPosts"
         WHERE "postID" = $1;
        `, [postID]
    );

    return resultHashtagPost;
}

const getUniqueHashtags = async () => {

    const uniqueHashtags = await db.query(
        `SELECT "hashtagID"
         FROM "hashtagPosts"
            GROUP BY "hashtagID"
         HAVING COUNT(DISTINCT "postID") = 1;
        `
    );

    return uniqueHashtags.rows;
}

const createAndInsertHashtags = async (hashtags, postID) => {

    const getResult = getHashtagsInDatabase(hashtags); 
    const getQueryResult = await db.query(getResult.query, getResult.queryParams);

    const insertHashtags = {};
    getQueryResult.rows.forEach(result => insertHashtags[result.hashtag] = result.id);

    const { newHashtags } = verifyNewHashtags(getQueryResult.rows, hashtags);
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
            insertHashtags[hashtag] = hashtagID;
        }
    }

    const insertQueryResult = insertHashtagsFromPost(hashtags, insertHashtags, postID);
    await db.query(insertQueryResult.query, insertQueryResult.queryParams);
}

const deleteHashtags = async (resultHashtagPost, postID) => {

    const hashtagsIDs = [];
    resultHashtagPost.rows.forEach(result => {
        if (!hashtagsIDs.includes(result.hashtagID)) {
            hashtagsIDs.push(result.hashtagID);
        }
    });

    const uniqueHashtags = await getUniqueHashtags();

    const uniqueHashtagsIDs = [];
    uniqueHashtags.forEach(singleHashtag => {
        if (hashtagsIDs.includes(singleHashtag.hashtagID)) {
            uniqueHashtagsIDs.push(singleHashtag.hashtagID);
        }
    })

    const deleteQueryResult = deleteHastagsInDatabase(hashtagsIDs, postID, uniqueHashtagsIDs);
    await db.query(deleteQueryResult.firstQuery, deleteQueryResult.firstQueryParams);

    if (uniqueHashtagsIDs.length > 0) {
        await db.query(deleteQueryResult.secondQuery, deleteQueryResult.secondQueryParams);
    }
}


const hashtagsService = {
    getHashtagsByPost,
    getUniqueHashtags,
    createAndInsertHashtags,
    deleteHashtags
}

export default hashtagsService;