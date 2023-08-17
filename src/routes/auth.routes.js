import { Router } from "express";
import {
    signIn,
    signUp,
    logout
} from "../controllers/auth.controller.js";

import { schemaValidation } from "../middlewares/schemaValidation.js";
import { userSignUpSchema, userSignInSchema } from "../schemas/auth.schema.js";

const authRouter = Router();

authRouter.post("/", schemaValidation(userSignInSchema), signIn);
authRouter.post("/sign-up", schemaValidation(userSignUpSchema), signUp);
authRouter.post("/logout", logout);

export default authRouter;