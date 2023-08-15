import { Router } from "express";

import {
    createPost,
    updatePost,
    deletePost
} from "../controllers/posts.controller.js";

const postsRouter = Router();

postsRouter.post("/create-post", createPost);
postsRouter.put("/update-post", updatePost);
postsRouter.delete("/delete-post", deletePost);

export default postsRouter;