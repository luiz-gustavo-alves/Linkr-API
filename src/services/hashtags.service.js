import db from "../database/db.connection.js";

function hashtagsList() {
    //Aqui estou retornando um array com {id, hashtag, cont} em que temos o nome e o id da hashtag e o número de posts para ela.
    const result = db.query(`
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
  
function hashtagPosts(id) {
    const result = db.query(`
    SELECT
    h."hashtag", p."id" AS "postID", p."description", p."URL", u."id" AS "userID", u."name", u."imageURL",
    COALESCE(l."likes_count", 0) AS "likes",
    COALESCE(arr_agg(u2."name") FILTER (WHERE u2."name" IS NOT NULL), ARRAY[]::VARCHAR[]) AS "lastLikes"
    FROM "hashtagPosts" hp
    JOIN "hashtags" h ON hp."hashtagID" = h."id"
    JOIN "posts" p ON hp."postID" = p."id"
    JOIN "users" u ON p."userID" = u."id"
    LEFT JOIN (
        SELECT "postID", COUNT(*) AS "likes_count"
        FROM "likes"
        GROUP BY "postID"
    ) l ON p."id" = l."postID"
    LEFT JOIN LATERAL (
        SELECT "userID"
        FROM "likes" l2
        WHERE l2."postID" = p."id"
        ORDER BY l2."createdAt" DESC
        LIMIT 3
    ) ll ON TRUE
    LEFT JOIN "users" u2 ON ll."userID" = u2."id"
    WHERE hp."hashtagID" = $1
    ORDER BY p."createdAt" DESC;
    `, [id]);
    return result;
}

function ex () {
    const result = db.query(``);
    return result;
}

const hashtagsService = {
    hashtagsList,
    hashtagPosts
}

export default hashtagsService;