function getHashtagsInDatabase (hashtags) {

    let query = 'SELECT hashtags.id, hashtags.hashtag FROM hashtags WHERE hashtag IN (';
    const queryParams = [];

    const uniqueHashtags = [...new Set(hashtags)];

    const hashtagsLen = uniqueHashtags.length;
    uniqueHashtags.forEach((hashtag, index) => {

        queryParams.push(hashtag);

        if (index + 1 === hashtagsLen) {
            query += `$${queryParams.length});`;
        } else {
            query += `$${queryParams.length}, `;
        }
    });

    return { query, queryParams };
}

export default getHashtagsInDatabase;