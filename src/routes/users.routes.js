import { Router } from "express";

import {
    getTimelinePosts,
    getPostsByUser,
    getPostsBySearch
} from "../controllers/users.controller.js";

import { authValidation } from "../middlewares/authValidation.js";

const usersRouter = Router();

usersRouter.get("/timeline", authValidation, getTimelinePosts);
usersRouter.get("/user/:id", getPostsByUser);
usersRouter.get("/timeline/search/", getPostsBySearch);

export default usersRouter;