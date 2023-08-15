import authService from "../services/auth.service.js";

export const signIn = async (req, res) => {
    res.send(req.body);
}

export const signUp = async (req, res) => {
    res.send(req.body);
}

export const logout = async (req, res) => {
    res.send(req.body);
}