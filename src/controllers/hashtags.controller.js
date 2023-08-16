import hashtagsService from "../services/hashtags.service";

export async function getHashtagsList (req, res){
    try{
        const result = hashtagsService.hashtagsList();
        res.status(200).send(result.rows);
    } catch (err) {
        res.status(500).send({ message: "Error getting hashtags list: " + err.message });
    }
}

export async function getHashtagsPosts (req, res){
    const { id } = req.params;
    try{
        const result = hashtagsService.hashtagPosts(id);
        res.status(200).send(result.rows);
    } catch (err) {
        res.status(500).send({ message: "Error getting hashtag posts: " + err.message });
    }
}