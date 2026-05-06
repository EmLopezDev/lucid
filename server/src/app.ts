import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import api from "./routes/api";
import config from "./config";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

const corsOptions = {
    origin: config.ALLOWED_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: config.MONGO_URL }),
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
