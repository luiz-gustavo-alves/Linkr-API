import { Router } from "express";

import {
    signIn,
    signUp,
    logout
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/", signIn);
authRouter.post("/sign-up", signUp);
authRouter.post("/logout", logout);

export default authRouter;