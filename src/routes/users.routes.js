import { Router } from "express";

import {
    getPosts,
    getPostsByUser,
    getPostsBySearch
} from "../controllers/users.controller.js";

const usersRouter = Router();

usersRouter.get("/timeline", getPosts);
usersRouter.get("/user/:id", getPostsByUser);
usersRouter.get("/timeline/search/", getPostsBySearch);

export default usersRouter;