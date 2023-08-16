function insertHashtagsFromPost (hashtagsIDs, postID) {

    let query = 'INSERT INTO "hashtagPosts" ("hashtagID", "postID") VALUES ';
    const queryParams = [];

    const hashtagsLen = hashtagsIDs.length;
    hashtagsIDs.forEach((id, index) => {

        queryParams.push(id);
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