import db from "../database/db.connection.js";
import {
    checkHashtagsInDatabase,
    verifyNewHashtags,
    insertHashtagsFromPost,
    deleteHastagsInDatabase
} from "../utils/hashtags/index.js";

const getUniqueHashtags = async () => {

    const uniqueHashtags = await db.query(
        `SELECT "hashtagID"
         FROM "hashtagPosts"
         GROUP BY "hashtagID"
         HAVING COUNT(*) = 1;
        `
    );

    return uniqueHashtags.rows;
}

const createAndInsertHashtags = async (hashtags, postID) => {

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

const deleteHashtags = async (postID) => {

    const resultHashtagPost = await db.query(
        `SELECT "hashtagPosts".*, 
                hashtags.hashtag
         FROM "hashtagPosts"
         JOIN hashtags
            ON hashtags.id = "hashtagPosts"."hashtagID"
         WHERE "postID" = $1
        `, [postID]
    );

    if (resultHashtagPost.rows.length > 0) {

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

        const queryResult = deleteHastagsInDatabase(hashtagsIDs, postID, uniqueHashtagsIDs);
        await db.query(queryResult.firstQuery, queryResult.firstQueryParams);

        if (uniqueHashtagsIDs.length > 0) {
            await db.query(queryResult.secondQuery, queryResult.secondQueryParams);
        }
    }
}


const hashtagService = {
    getUniqueHashtags,
    createAndInsertHashtags,
    deleteHashtags
}

export default hashtagService;