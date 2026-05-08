import * as Sentry from "@sentry/node";
import { type Request, type Response, type NextFunction } from "express";

export const sentryUser = (req: Request, _res: Response, next: NextFunction) => {
    if (req.session?.userId) {
        Sentry.setUser({ id: req.session.userId });
    } else {
        Sentry.setUser(null);
    }
    next();
};
