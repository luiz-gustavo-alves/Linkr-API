import { Router } from "express";
import { getHashtagsList, getHashtagsPosts } from "../controllers/hashtags.controller.js";

const hashtagsRouter = Router();

hashtagsRouter.get("/hashtags", getHashtagsList);
hashtagsRouter.get("/hashtags/:id", getHashtagsPosts);

export default hashtagsRouter;