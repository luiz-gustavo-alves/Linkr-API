function deleteHastagsInDatabase (hashtagsIDs, postID, uniqueHashtagsIDs) {

    const firstQueryParams = [postID];
    let firstQuery = `DELETE FROM "hashtagPosts" WHERE "postID" = $${firstQueryParams.length} AND "hashtagID" IN (`;

    const hashtagsLen = hashtagsIDs.length;
    hashtagsIDs.forEach((id, index) => {

        firstQueryParams.push(id);

        if (index + 1 === hashtagsLen) {
            firstQuery += `$${firstQueryParams.length});`;
        } else {
            firstQuery += `$${firstQueryParams.length}, `;
        }
    });

    if (uniqueHashtagsIDs.length === 0) {
        return { firstQuery, firstQueryParams };
    }

    const secondQueryParams = [];
    let secondQuery = `DELETE FROM hashtags WHERE id = `;

    const uniqueHashtagsLen = uniqueHashtagsIDs.length;
    uniqueHashtagsIDs.forEach((uniqueHashtag, index) => {

        secondQueryParams.push(uniqueHashtag);

        if (index + 1 === uniqueHashtagsLen) {
            secondQuery += `$${secondQueryParams.length};`;
        } else {
            secondQuery += `$${secondQueryParams.length} OR id = `;
        }
    });

    return { firstQuery, firstQueryParams, secondQuery, secondQueryParams };
}

export default deleteHastagsInDatabase;