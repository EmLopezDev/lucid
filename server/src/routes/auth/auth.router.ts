import express from "express";
import {
    authRegisterUser,
    authSignInUser,
    authSignOutUser,
    authGetSession,
} from "./auth.controller";

const AuthRouter = express.Router();

AuthRouter.get("/session", authGetSession);
AuthRouter.post("/register", authRegisterUser);
AuthRouter.post("/signin", authSignInUser);
AuthRouter.post("/signout", authSignOutUser);

export default AuthRouter;
