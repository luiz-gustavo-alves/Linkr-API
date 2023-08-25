import { Router } from "express";
import { getHashtagsList, getHashtagsPosts } from "../controllers/hashtags.controller.js";
import { authValidation } from "../middlewares/authValidation.js";

const hashtagsRouter = Router();

hashtagsRouter.get("/hashtags", getHashtagsList);
hashtagsRouter.get("/hashtags/:hashtag", authValidation, getHashtagsPosts);

export default hashtagsRouter;