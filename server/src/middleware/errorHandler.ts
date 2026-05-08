import { type NextFunction, type Request, type Response } from "express";
import logger from "../services/logger";

type HttpError = Error & { status?: number; statusCode?: number };

export const errorHandler = (err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status ?? err.statusCode ?? 500;
    const message = status < 500 ? err.message : "Internal server error";

    logger.error({ err, status }, "errorHandler caught error");

    res.status(status).json({ message });
};
