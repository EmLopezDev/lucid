import { type Request, type Response, type NextFunction } from "express";

export const requireOwner = (req: Request, res: Response, next: NextFunction) => {
    if (req.params.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};
