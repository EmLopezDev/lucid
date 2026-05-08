import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import logger from "./services/logger";
import session from "express-session";
import MongoStore from "connect-mongo";
import api from "./routes/api";
import config from "./config";
import rateLimit from "express-rate-limit";
import { sanitizeBody } from "./middleware/sanitize";
import { errorHandler } from "./middleware/errorHandler";
import { mongoClientPromise } from "./services/mongo";

const app = express();

const corsOptions = {
    origin: config.ALLOWED_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.set("trust proxy", 1);
app.use("/api/v1/auth", authLimiter);
app.use("/api/v1", generalLimiter);
app.options(/^\/api\/v1\//, cors(corsOptions));
app.use("/api/v1", cors(corsOptions));
app.use(helmet());

app.use(pinoHttp({ logger }));

app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.json({ limit: "10kb" }));
app.use(sanitizeBody);

app.use(
    session({
        name: "sid",
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ clientPromise: mongoClientPromise }),
        cookie: {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
    }),
);

app.use("/api/v1", api);

app.use(errorHandler);

export default app;
