import postsService from "../services/posts.service.js";

export const createPost = async (req, res) => {

    const { hashtags } = res.locals;

    try {
        await postsService.createPost(req.body, hashtags, /*userID*/);
        res.sendStatus(200);

    } catch (err){
        res.send(err.message);
    }
}

export const updatePost = async (req, res) => {

    try {


    } catch (err ){
        res.send(err.message);
    }
}

export const deletePost = async (req, res) => {

    try {


    } catch (err ){
        res.send(err.message);
    }
}