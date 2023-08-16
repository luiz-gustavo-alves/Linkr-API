function insertHashtagsFromPost (hashtags, insertHashtags, postID) {

    let query = 'INSERT INTO "hashtagPosts" ("hashtagID", "postID") VALUES ';
    const queryParams = [];

    const hashtagsLen = hashtags.length;
    hashtags.forEach((hashtag, index) => {

        const hashtagID = insertHashtags[hashtag];

        queryParams.push(hashtagID);
        queryParams.push(postID);
        
        if (index + 1 === hashtagsLen) {
            query += `($${queryParams.length - 1}, $${queryParams.length});`;
        } else {
            query += `($${queryParams.length - 1}, $${queryParams.length}),`;
        }
    })

    return { query, queryParams };
}

export default insertHashtagsFromPost;