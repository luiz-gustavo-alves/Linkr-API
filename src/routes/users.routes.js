import { Router } from "express";

import {
    getTimelinePosts,
    getPostsByUser,
    getUsersBySearch,
    postLike
} from "../controllers/users.controller.js";

import { authValidation } from "../middlewares/authValidation.js";

const usersRouter = Router();

usersRouter.get("/timeline", authValidation, getTimelinePosts);
usersRouter.get("/user/:id", getPostsByUser);
usersRouter.get("/timeline/search/users/:search", getUsersBySearch)
usersRouter.post("/post/like", postLike)

export default usersRouter;