import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
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

app.use("/api/v1", api);

app.use(errorHandler);

export default app;
