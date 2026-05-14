import express from "express";
import {
    authRegisterUser,
    authSignInUser,
    authSignOutUser,
    authGetSession,
    authForgotPassword,
    authResetPassword,
    authVerifyEmail,
} from "./auth.controller";

const AuthRouter = express.Router();

AuthRouter.get("/session", authGetSession);
AuthRouter.post("/register", authRegisterUser);
AuthRouter.post("/signin", authSignInUser);
AuthRouter.post("/signout", authSignOutUser);
AuthRouter.post("/forgot-password", authForgotPassword);
AuthRouter.post("/reset-password", authResetPassword);
AuthRouter.get("/verify-email", authVerifyEmail);

export default AuthRouter;
