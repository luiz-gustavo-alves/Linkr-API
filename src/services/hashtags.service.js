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
  
function hashtagPosts(hashtag) {
    const result = db.query(`
    SELECT
    h."hashtag",
    json_agg(
        json_build_object(
            'postID', p."id",
            'description', p."description",
            'URL', p."URL",
            'user', json_build_object(
                'id', u."id",
                'name', u."name",
                'img', u."imageURL"
            ),
            'likes', COALESCE(l."likes_count", 0),
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

function ex () {
    const result = db.query(``);
    return result;
}

const hashtagsService = {
    hashtagsList,
    hashtagPosts
}

export default hashtagsService;