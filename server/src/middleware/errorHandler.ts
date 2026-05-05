import { type NextFunction, type Request, type Response } from "express";

type HttpError = Error & { status?: number; statusCode?: number };

export const errorHandler = (
    err: HttpError,
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
    const status = err.status ?? err.statusCode ?? 500;
    const message = status < 500 ? err.message : "Internal server error";

    res.status(status).json({ message });
};
