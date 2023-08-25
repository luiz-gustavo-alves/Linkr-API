import hashtagsService from "../services/hashtags.service.js";
import addComments from "../utils/comments/index.js";

export async function getHashtagsList(req, res) {

    try {
        const result = await hashtagsService.hashtagsList();
        res.status(200).send(result.rows);
    } catch (err) {
        res.status(500).send({ message: "Error getting hashtags list: " + err.message });
    }
}

export async function getHashtagsPosts(req, res) {
    const { hashtag } = req.params;
    const { userID } = res.locals;

    try {
        const result = await hashtagsService.hashtagPosts(hashtag);
        const resultWithComments = await addComments(result.rows[0].posts, userID);

        const hashtagsWithComments = {
            hashtag: result.rows[0].hashtag,
            posts: resultWithComments
        }

        res.status(200).send(hashtagsWithComments);
    } catch (err) {
        res.status(500).send({ message: "Error getting hashtag posts: " + err.message });
    }
}