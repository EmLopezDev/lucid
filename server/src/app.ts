import * as Sentry from "@sentry/node";
import express from "express";

import helmet from "helmet";
import api from "./routes/api";
import { corsMiddleware } from "./middleware/cors";
import { authLimiter, generalLimiter } from "./middleware/rateLimiter";
import { httpLogger } from "./middleware/httpLogger";
import { sanitizeBody } from "./middleware/sanitize";
import { sessionMiddleware } from "./middleware/session";
import { errorHandler } from "./middleware/errorHandler";
import { sentryUser } from "./middleware/sentryUser";

const app = express();

app.set("trust proxy", 1);

app.options(/^\/api\/v1\//, corsMiddleware);
app.use("/api/v1", corsMiddleware);

app.use("/api/v1/auth", authLimiter);
app.use("/api/v1", generalLimiter);

app.use(helmet());

app.use(httpLogger);

app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.json({ limit: "10kb" }));

app.use(sanitizeBody);

app.use(sessionMiddleware);
app.use(sentryUser);

app.use("/api/v1", api);

Sentry.setupExpressErrorHandler(app);
app.use(errorHandler);

export default app;
