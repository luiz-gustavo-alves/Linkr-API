import { Router } from "express";

import {
    getPosts,
    getPostsByUser,
    getPostsByHashtag,
    getPostsBySearch
} from "../controllers/users.controller.js";

const usersRouter = Router();

usersRouter.get("/timeline", getPosts);
usersRouter.get("/user/:id", getPostsByUser);
usersRouter.get("/hashtag/:hashtag", getPostsByHashtag);
usersRouter.get("/timeline/search/", getPostsBySearch);

export default usersRouter;