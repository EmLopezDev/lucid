import express from "express";
import {
    authRegisterUser,
    authSignInUser,
    authSignOutUser,
} from "./authController";

const authRouter = express.Router();

authRouter.post("/register", authRegisterUser);
authRouter.post("/signin", authSignInUser);
authRouter.post("/signout", authSignOutUser);

export default authRouter;
