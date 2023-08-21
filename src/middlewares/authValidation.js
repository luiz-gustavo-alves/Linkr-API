import authService from "../services/auth.service.js";
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"

dotenv.config();

export const authValidation = async (req, res, next) => {

    const { authorization } = req.headers;
    const token = authorization.replace("Bearer ", "");

    if (!token) {
        return res.sendStatus(401);
    }

    try {

        jwt.verify(token, process.env.JWT_SECRET || 'test', (error, decoded) => {
           
            if (error) {
                return res.sendStatus(401);
            }

            res.locals.userID = decoded.id;
            next();
        })

    } catch (err) {
        res.status(500).send(err.message)
    }
}