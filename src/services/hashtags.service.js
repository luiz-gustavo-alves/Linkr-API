import db from "../database/db.connection.js";
import {
    verifyNewHashtags
} from "../utils/hashtags/index.js";

const getHashtagsByPost = async (postID) => {

    const resultHashtagPost = await db.query(
        `SELECT * FROM "hashtagPosts"
         WHERE "postID" = $1;
        `, [postID]
    );

    return resultHashtagPost;
}

const getUniqueHashtags = async (queryParams, hashtagsIDs) => {

    const uniqueHashtags = await db.query(
        `SELECT "hashtagID"
         FROM "hashtagPosts"
            GROUP BY "hashtagID"
         HAVING COUNT(DISTINCT "postID") = 1 AND "hashtagID" IN ${queryParams};
        `, [...hashtagsIDs]
    );

    return uniqueHashtags.rows;
}

const createAndInsertHashtags = async (hashtags, postID) => {

    const uniqueHashtags = [...new Set(hashtags)];

    /* Dynamic SQL query to check requested hashtags in database */
    let queryValues = uniqueHashtags.map((params, index) => `$${index + 1}`).join(", ");
    queryValues = "(" + queryValues + ")";

    const getQueryResult = await db.query(
        `SELECT hashtags.id, hashtags.hashtag 
         FROM hashtags 
         WHERE hashtag IN ${queryValues};
        `, [...uniqueHashtags]
    );

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

    /* Dynamic SQL query to insert hashtags from post */
    queryValues = [];
    hashtags.forEach((hashtag) => {
      queryValues.push(insertHashtags[hashtag]);
      queryValues.push(postID)
    })

    const queryParams = queryValues.map((value, index) => {
      if ((index + 1) % 2 === 0) return `$${index + 1})`;
      else return `($${index + 1}`;
    }).join(", ");

    await db.query(
        `INSERT INTO "hashtagPosts"
            ("hashtagID", "postID")
         VALUES ${queryParams}
        `, [...queryValues]
    );
}

const deleteHashtags = async (resultHashtagPost, postID) => {

    const hashtagsIDs = [];
    resultHashtagPost.rows.forEach(result => {
        if (!hashtagsIDs.includes(result.hashtagID)) {
            hashtagsIDs.push(result.hashtagID);
        }
    });

    /* Dynamic SQL query to check unique hashtags in database */
    let queryParams = hashtagsIDs.map((params, index) => `$${index + 1}`).join(", ");
    queryParams = "(" + queryParams + ")";

    const uniqueHashtags = await getUniqueHashtags(queryParams, hashtagsIDs);

    const uniqueHashtagsIDs = [];
    uniqueHashtags.forEach(singleHashtag => {
        if (hashtagsIDs.includes(singleHashtag.hashtagID)) {
            uniqueHashtagsIDs.push(singleHashtag.hashtagID);
        }
    })
    
    /* Dynamic SQL query to delete hashtags from posts in database */
    queryParams = hashtagsIDs.map((params, index) => `$${index + 2}`).join(", ");
    queryParams = "(" + queryParams + ")";

    await db.query(
        `DELETE FROM "hashtagPosts" 
         WHERE "postID" = $1 AND "hashtagID" IN ${queryParams}
        `, [postID, ...hashtagsIDs]
    );

    if (uniqueHashtagsIDs.length > 0) {

        /* Dynamic SQL query to delete unique hashtags in database */
        queryParams = uniqueHashtagsIDs.map((params, index) => {
            if ((index + 1) < uniqueHashtags.length) return `id = $${index + 1} OR `;
            else return `id = $${index + 1}`;
        }).join("");

        await db.query(
            `DELETE FROM hashtags 
             WHERE ${queryParams};
            `, [...uniqueHashtagsIDs]
        );
    }
}

async function hashtagsList() {
    //Aqui estou retornando um array com {id, hashtag, cont} em que temos o nome e o id da hashtag e o número de posts para ela.
    const result = await db.query(`
    SELECT h."id" AS "id", h."hashtag" AS "hashtag", COUNT(hp."postID") AS "cont"
    FROM "hashtags" h
    LEFT JOIN "hashtagPosts" hp ON h."id" = hp."hashtagID"
    GROUP BY h."id", h."hashtag"
    ORDER BY "cont" DESC
    LIMIT 10;
    `);

    return result;
}

const exampleResult = [
    {
      hashtag: "example_hashtag",
      posts: [
        {
          postID: 1,
          description: "Example post description 1",
          URL: "https://example.com/post1",
          user: {
            id: 101,
            name: "John Doe",
            img: "https://example.com/images/john.jpg"
          },
          likes: 5,
          lastLikes: ["Alice", "Bob", "Eve"]
        },
        {
          postID: 2,
          description: "Example post description 2",
          URL: "https://example.com/post2",
          user: {
            id: 102,
            name: "Jane Smith",
            img: "https://example.com/images/jane.jpg"
          },
          likes: 8,
          lastLikes: ["Charlie", "David", "Fiona"]
        },
        // ... outros posts ...
      ]
    },
  ];
  
async function hashtagPosts(hashtag) {
    const result = await db.query(`
    SELECT
    h."hashtag",
    json_agg(
        json_build_object(
            'postID', p."id",
            'description', p."description",
            'URL', p."URL",
            'URL_title', p."URL_title",
            'URL_description', p."URL_description",
            'URL_image', p."URL_image",
            'createdAt', p."createdAt",
            'user', json_build_object(
                'id', u."id",
                'name', u."name",
                'img', u."imageURL"
            ),
            'likes', COALESCE(l."likes_count", 0),
            'allLikedUserIDs', (
                SELECT array_agg(l4."userID")
                FROM "likes" l4
                WHERE l4."postID" = p."id"
            ),
            'lastLikes', (
                SELECT COALESCE(array_agg(u2."name") FILTER (WHERE u2."name" IS NOT NULL), ARRAY[]::VARCHAR[])
                FROM (
                    SELECT "userID"
                    FROM "likes" l2
                    WHERE l2."postID" = p."id"
                    ORDER BY l2."id" DESC
                    LIMIT 3
                ) l3
                JOIN "users" u2 ON l3."userID" = u2."id"
            )
        )
    ) AS posts
    FROM "hashtags" h
    JOIN "hashtagPosts" hp ON h."id" = hp."hashtagID"
    JOIN "posts" p ON hp."postID" = p."id"
    JOIN "users" u ON p."userID" = u."id"
    LEFT JOIN (
        SELECT "postID", COUNT(*) AS "likes_count"
        FROM "likes"
        GROUP BY "postID"
    ) l ON p."id" = l."postID"
    WHERE h."hashtag" = $1
    GROUP BY h."hashtag";
    `, [hashtag]);
    return result;
}

const hashtagsService = {
    getHashtagsByPost,
    getUniqueHashtags,
    createAndInsertHashtags,
    deleteHashtags,
    hashtagsList,
    hashtagPosts
}

export default hashtagsService;