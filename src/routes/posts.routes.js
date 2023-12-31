import { Router } from "express";

import {
    createPost,
    updatePost,
    deletePost
} from "../controllers/posts.controller.js";

import { authValidation } from "../middlewares/authValidation.js";
import { schemaValidation } from "../middlewares/schemaValidation.js";
import { getHashtags } from "../middlewares/getHashtags.js";
import { checkPostID } from "../middlewares/checkPostID.js";
import { postsSchema } from "../schemas/posts.schema.js";

const postsRouter = Router();

postsRouter.post("/create-post", authValidation, schemaValidation(postsSchema), getHashtags, createPost);
postsRouter.put("/update-post/:postID", authValidation, checkPostID, schemaValidation(postsSchema), getHashtags, updatePost);
postsRouter.delete("/delete-post/:postID", authValidation, checkPostID, deletePost);

export default postsRouter;