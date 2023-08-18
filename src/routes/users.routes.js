import { Router } from "express";

import {
    getTimelinePosts,
    getPostsByUser,
    getPostsBySearch
} from "../controllers/users.controller.js";

const usersRouter = Router();

usersRouter.get("/timeline", getTimelinePosts);
usersRouter.get("/user/:id", getPostsByUser);
usersRouter.get("/timeline/search/", getPostsBySearch);

export default usersRouter;