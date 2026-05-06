import { type Request, type Response } from "express";
import { flattenError } from "zod";
import { UserRegister, UserSignin } from "../../../../packages/types/UserTypes";
import { findUserById, registerUser, signinUser } from "../../models/user/user.model";

export const authRegisterUser = async (req: Request, res: Response) => {
    const result = UserRegister.safeParse(req.body);
    if (!result.success) {
        return res.status(404).send(flattenError(result.error).fieldErrors);
    }
    try {
        const user = await registerUser(result.data);
        res.status(200).json(user);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send({ message: error.message });
        }
    }
};

export const authSignInUser = async (req: Request, res: Response) => {
    const result = UserSignin.safeParse(req.body);
    if (!result.success) {
        return res.status(404).send(flattenError(result.error).fieldErrors);
    }
    try {
        const user = await signinUser(result.data);
        req.session.userId = String(user._id);
        res.status(200).json(user);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send({ message: error.message });
        }
    }
};

export const authSignOutUser = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Failed to sign out" });
        }
        res.clearCookie("connect.sid");
        res.json({ message: "Signed out successfully" });
    });
};

export const authGetSession = async (req: Request, res: Response) => {
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
    } catch {
        res.status(500).json({ message: "Internal server error" });
    }
};
