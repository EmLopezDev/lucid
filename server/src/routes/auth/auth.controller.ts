import * as Sentry from "@sentry/node";
import { type Request, type Response, type NextFunction } from "express";
import { flattenError } from "zod";
import {
    UserRegister,
    UserSignin,
    UserForgotPassword,
    UserResetPassword,
} from "../../../../packages/types/UserTypes";
import {
    findUserById,
    registerUser,
    requestPasswordReset,
    resetUserPassword,
    signinUser,
} from "../../models/user/user.model";

export const authRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
    const result = UserRegister.safeParse(req.body);
    if (!result.success) {
        return res.status(400).send(flattenError(result.error).fieldErrors);
    }
    try {
        await registerUser(result.data);
        res.status(201).end();
    } catch (error) {
        next(error);
    }
};

export const authSignInUser = async (req: Request, res: Response, next: NextFunction) => {
    const result = UserSignin.safeParse(req.body);
    if (!result.success) {
        return res.status(400).send(flattenError(result.error).fieldErrors);
    }
    try {
        const user = await signinUser(result.data);
        req.session.regenerate((err) => {
            if (err) return next(err);
            req.session.userId = String(user._id);
            req.session.save((err) => {
                if (err) {
                    res.status(500).json({ message: "Failed to create session" });
                    return;
                }
                res.status(200).json(user);
            });
        });
    } catch (error) {
        next(error);
    }
};

export const authSignOutUser = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        Sentry.setUser(null);
        if (err) {
            return res.status(500).json({ message: "Failed to sign out" });
        }
        res.clearCookie("sid");
        res.json({ message: "Signed out successfully" });
    });
};

export const authGetSession = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    try {
        const user = await findUserById(req.session.userId);
        if (!user) {
            req.session.destroy(() => {});
            return res.status(401).json({ message: "Not authenticated" });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const authForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = UserForgotPassword.safeParse(req.body);
        if (!body.success) {
            return res.status(400).send(flattenError(body.error).fieldErrors);
        }
        await requestPasswordReset(body.data.email);
        return res.status(200).end();
    } catch (error) {
        next(error);
    }
};

export const authResetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = UserResetPassword.safeParse(req.body);
        if (!body.success) {
            return res.status(400).send(flattenError(body.error).fieldErrors);
        }
        await resetUserPassword(body.data.hash, body.data.new_password);
        return res.status(200).end();
    } catch (error) {
        next(error);
    }
};
