function checkHashtagsInDatabase (hashtags) {

    let query = 'SELECT hashtags.id, hashtags.hashtag FROM hashtags WHERE hashtag IN (';
    const queryParams = [];

    const hashtagsLen = hashtags.length;
    hashtags.forEach((hashtag, index) => {

        queryParams.push(hashtag);

        if (index + 1 === hashtagsLen) {
            query += `$${queryParams.length});`;
        } else {
            query += `$${queryParams.length}, `;
        }
    });

    return { query, queryParams };
}

export default checkHashtagsInDatabase;