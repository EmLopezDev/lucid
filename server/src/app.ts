import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import api from "./routes/api";
import config from "./config";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
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

app.use(
    morgan(`
        {
            METHOD => :method
            URL => :url
            STATUS => :status
            RES-TYPE => :res[content-type]
            RES-TIME => :response-time ms
            USER AGENT => :user-agent
        }
        `),
);

app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.json({ limit: "10kb" }));
app.use(
    mongoSanitize({
        onSanitize: ({ req, key }) => {
            console.warn(`Sanitized key: ${key} from ${req.path}`);
        },
    }),
);

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
