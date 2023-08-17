import { Router } from "express";
import { getHashtagsList, getHashtagsPosts } from "../controllers/hashtags.controller";

const hashtagsRouter = Router();

hashtagsRouter.get("/hashtags", getHashtagsList);
hashtagsRouter.get("/hashtags/:hashtag", getHashtagsPosts);

export default hashtagsRouter;