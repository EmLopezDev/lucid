import { type Request, type Response, type NextFunction } from "express";
import mongoSanitize from "express-mongo-sanitize";
import logger from "../services/logger";

export const sanitizeBody = (req: Request, _res: Response, next: NextFunction) => {
    if (!req.body) return next();

    const original = JSON.stringify(req.body);
    req.body = mongoSanitize.sanitize(req.body);

    if (JSON.stringify(req.body) !== original) {
        logger.warn({ path: req.path, method: req.method }, "Sanitized prohibited keys from request body");
    }

    next();
};
