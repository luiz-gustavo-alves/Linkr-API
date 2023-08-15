import usersService from "../services/users.service.js";

export const getPosts = async (req, res) => {
    res.send(req.body);
}

export const getPostsByUser = async (req, res) => {
    res.send(req.body);
}

export const getPostsByHashtag = async (req, res) => {
    res.send(req.body);
}

export const getPostsBySearch = async (req, res) => {
    res.send(req.body);
}