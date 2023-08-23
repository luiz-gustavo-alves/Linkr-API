import postsService from "../services/posts.service.js";

export const createPost = async (req, res) => {

    const { hashtags, userID } = res.locals;

    try {
        await postsService.createPost(req.body, hashtags, userID);
        res.sendStatus(201);

    } catch (err) {
        res.send(err.message);
    }
}

export const updatePost = async (req, res) => {

    const { hashtags, userID } = res.locals;
    const { postID } = req.params;

    try {
        await postsService.updatePost(req.body, hashtags, postID, userID);
        res.sendStatus(200);

    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
}

export const deletePost = async (req, res) => {

    const { userID } = res.locals;
    const { postID } = req.params;

    try {
        await postsService.deletePost(postID, userID);
        res.sendStatus(204);

    } catch (err) {
        res.send(err.message);
    }
}