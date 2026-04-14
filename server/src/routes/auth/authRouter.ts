import express, { type Response, type Request } from "express";

const authRouter = express.Router();

authRouter.get("/register", (_req: Request, res: Response) => {
    res.json("Register Page");
});

authRouter.get("/signin", (_req: Request, res: Response) => {
    res.json("Signin Page");
});

export default authRouter;
