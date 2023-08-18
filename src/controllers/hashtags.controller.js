import hashtagsService from "../services/hashtags.service.js";

export async function getHashtagsList (req, res){
    try{
        const result = await hashtagsService.hashtagsList();
        console.log(result.rows);
        res.status(200).send(result.rows);
    } catch (err) {
        res.status(500).send({ message: "Error getting hashtags list: " + err.message });
    }
}

export async function getHashtagsPosts (req, res){
    const { hashtag } = req.params;
    try{
        const result = await hashtagsService.hashtagPosts(hashtag);
        res.status(200).send(result.rows);
    } catch (err) {
        res.status(500).send({ message: "Error getting hashtag posts: " + err.message });
    }
}