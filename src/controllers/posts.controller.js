import postsService from "../services/posts.service.js";

export const createPost = async (req, res) => {

    const { hashtags } = res.locals;

    try {
        await postsService.createPost(req.body, hashtags, 1);
        res.sendStatus(201);

    } catch (err) {
        res.send(err.message);
    }
}

export const updatePost = async (req, res) => {

    const { hashtags } = res.locals;
    const { postID } = req.params;

    try {
        await postsService.updatePost(req.body, hashtags, postID, 1);
        res.sendStatus(200);

    } catch (err) {
        res.send(err.message);
    }
}

export const deletePost = async (req, res) => {

    const { postID } = req.params;

    try {
        await postsService.deletePost(postID, 1);
        res.sendStatus(204);

    } catch (err) {
        res.send(err.message);
    }
}