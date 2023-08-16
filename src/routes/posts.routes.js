import { Router } from "express";

import {
    createPost,
    updatePost,
    deletePost
} from "../controllers/posts.controller.js";

import { schemaValidation } from "../middlewares/schemaValidation.js";
import { getHashtags } from "../middlewares/getHashtags.js";

import { postsSchema } from "../schemas/posts.schema.js";

const postsRouter = Router();

postsRouter.post("/create-post", schemaValidation(postsSchema), getHashtags, createPost);
postsRouter.put("/update-post/:postID", schemaValidation(postsSchema), getHashtags, updatePost);
postsRouter.delete("/delete-post/:postID", deletePost);

export default postsRouter;