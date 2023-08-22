import { Router } from "express";

import {
    getTimelinePosts,
    getPostsByUser,
    getUsersBySearch,
    postLike,
    postFollow
} from "../controllers/users.controller.js";

import { authValidation } from "../middlewares/authValidation.js";

const usersRouter = Router();

usersRouter.get("/timeline", authValidation, getTimelinePosts);
usersRouter.get("/user/:id", getPostsByUser);
usersRouter.get("/timeline/search/users/:search", getUsersBySearch)
usersRouter.post("/post/like", postLike);
usersRouter.post("/follow", authValidation, postFollow);


export default usersRouter;