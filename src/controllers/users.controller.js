import usersService from "../services/users.service.js";

export const getTimelinePosts = async (req, res) => {

    const { offset } = req.query;
    
    try {
        const posts = await usersService.getTimelinePosts(offset, 1);
        res.send(posts);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const getPostsByUser = async (req, res) => {
    res.send(req.body);
}

export const getPostsBySearch = async (req, res) => {
    res.send(req.body);
}