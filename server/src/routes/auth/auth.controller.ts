import { type Request, type Response } from "express";
import { flattenError } from "zod";
import { UserRegister, UserSignin } from "../../../../packages/types/UserTypes";
import { registerUser, signinUser } from "../../models/user/user.model";

export const authRegisterUser = async (req: Request, res: Response) => {
    const result = UserRegister.safeParse(req.body);
    if (result.success) {
        try {
            const user = await registerUser(result.data);
            res.status(200).json(user);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).send({ message: error.message });
            }
        }
    } else {
        const flattenedError = flattenError(result.error);
        res.status(404).send(flattenedError.fieldErrors);
    }
};

export const authSignInUser = async (req: Request, res: Response) => {
    const result = UserSignin.safeParse(req.body);
    if (result.success) {
        try {
            const user = await signinUser(result.data);
            res.status(200).json(user);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).send({ message: error.message });
            }
        }
    } else {
        const flattenedError = flattenError(result.error);
        res.status(404).send(flattenedError.fieldErrors);
    }
};

export const authSignOutUser = (_req: Request, res: Response) => {
    res.json("User has logged out successfully!");
};
