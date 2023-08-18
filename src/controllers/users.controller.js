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
    const { id } = req.params;
    try{
        const result = await usersService.userPosts(id);
        res.status(200).send(result.rows);
    } catch (err) {
        res.status(500).send({ message: "Error getting hashtag posts: " + err.message });
    }
}

export const getPostsBySearch = async (req, res) => {
    res.send(req.body);
}