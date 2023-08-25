import { Router } from "express";

import {
    countTimelinePosts,
    getTimelinePosts,
    getPostsByUser,
    getUsersBySearch,
    postFollow,
    postLike,
    checkFollow,
    commentPost
} from "../controllers/users.controller.js";

import { authValidation } from "../middlewares/authValidation.js";

const usersRouter = Router();

usersRouter.get("/countTimelinePosts", countTimelinePosts);
usersRouter.get("/timeline", authValidation, getTimelinePosts);
usersRouter.get("/user/:id", authValidation, getPostsByUser);
usersRouter.get("/timeline/search/users/:search", getUsersBySearch);
usersRouter.post("/follow", authValidation, postFollow);
usersRouter.get("/follow/:id", authValidation, checkFollow);
usersRouter.post("/post/like", postLike);
usersRouter.post("/comments", authValidation, commentPost);

export default usersRouter;