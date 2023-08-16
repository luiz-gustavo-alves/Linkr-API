function verifyNewHashtags (hashtagsQuery, hashtags) {
    
    const hashTable = {};
    for (let i = 0; i < hashtagsQuery.length; i++) {

        const { hashtag } = hashtagsQuery[i];
        hashTable[hashtag] = true;
    }

    const newHashtags = [];
    for (let i = 0; i < hashtags.length; i++) {

        const hashtag = hashtags[i];
        if (!hashTable[hashtag]) {
            newHashtags.push(hashtag);
        }
    }

    return { newHashtags };
}

export default verifyNewHashtags;