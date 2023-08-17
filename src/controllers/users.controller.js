import usersService from "../services/users.service.js";

export const getPosts = async (req, res) => {
    res.send(req.body);
}

export const getPostsByUser = async (req, res) => {
    const { id } = req.params;
    try{
        //const result = await usersService
        res.status(200).send(result.rows);
    } catch (err) {
        res.status(500).send({ message: "Error getting hashtag posts: " + err.message });
    }
}

export const getPostsBySearch = async (req, res) => {
    res.send(req.body);
}