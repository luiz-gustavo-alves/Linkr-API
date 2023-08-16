import postsService from "../services/posts.service.js";

export const createPost = async (req, res) => {

    const { hashtags } = res.locals;

    try {
        await postsService.createPost(req.body, hashtags, /* userID */);
        res.sendStatus(201);

    } catch (err){
        res.send(err.message);
    }
}

export const updatePost = async (req, res) => {

    try {


    } catch (err){
        res.send(err.message);
    }
}

export const deletePost = async (req, res) => {

    const { postID } = req.params;
    if (!Number(postID)) {
        return res.sendStatus(403);
    }

    try {

        await postsService.deletePost(Number(postID), /* userID */);
        res.sendStatus(204);

    } catch (err){
        res.send(err.message);
    }
}