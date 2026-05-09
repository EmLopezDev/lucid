import * as Sentry from "@sentry/node";
import { type NextFunction, type Request, type Response } from "express";
import logger from "../services/logger";
import { HttpError } from "./HttpError";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    const status = err instanceof HttpError ? err.status : 500;
    const message = status < 500 ? err.message : "Internal server error";

    if (status >= 500) Sentry.captureException(err);
    logger.error({ err, status }, "errorHandler caught error");

    res.status(status).json({ message });
};
