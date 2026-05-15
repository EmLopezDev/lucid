import express from "express";
import {
    authRegisterUser,
    authSignInUser,
    authSignOutUser,
    authGetSession,
    authForgotPassword,
    authResetPassword,
    authResendVerification,
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
AuthRouter.post("/resend-verification", authResendVerification);

export default AuthRouter;
