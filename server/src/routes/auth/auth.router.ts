import express from "express";
import {
    authRegisterUser,
    authSignInUser,
    authSignOutUser,
} from "./auth.controller";

const AuthRouter = express.Router();

AuthRouter.post("/register", authRegisterUser);
AuthRouter.post("/signin", authSignInUser);
AuthRouter.post("/signout", authSignOutUser);

export default AuthRouter;
