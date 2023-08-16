import { Router } from "express";

import authRouter from "./auth.routes.js";
import hashtagsRouter from "./hashtags.routes.js";
import postsRouter from "./posts.routes.js";
import usersRouter from "./users.routes.js";

const router = Router();

router.use(authRouter);
router.use(postsRouter);
router.use(usersRouter);
router.use(hashtagsRouter);

export default router;