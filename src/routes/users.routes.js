import { Router } from "express";

import {
    countFollowing,
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
import { schemaValidation } from "../middlewares/schemaValidation.js";
import { commentsSchema } from "../schemas/comments.schema.js";

const usersRouter = Router();

usersRouter.get("countFollowing", authValidation, countFollowing);
usersRouter.get("/countTimelinePosts", authValidation, countTimelinePosts);
usersRouter.get("/timeline", authValidation, getTimelinePosts);
usersRouter.get("/user/:id", authValidation, getPostsByUser);
usersRouter.get("/timeline/search/users/:search", getUsersBySearch);
usersRouter.post("/follow", authValidation, postFollow);
usersRouter.get("/follow/:id", authValidation, checkFollow);
usersRouter.post("/post/like", postLike);
usersRouter.post("/comments", authValidation, schemaValidation(commentsSchema), commentPost);

export default usersRouter;