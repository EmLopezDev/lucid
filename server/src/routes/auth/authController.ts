import { type Request, type Response } from "express";

export const authRegisterUser = (_req: Request, res: Response) => {
    res.json("Register Page");
};

export const authSignInUser = (_req: Request, res: Response) => {
    res.json("Signin Page");
};

export const authSignOutUser = (_req: Request, res: Response) => {
    res.json("Signout Page");
};
