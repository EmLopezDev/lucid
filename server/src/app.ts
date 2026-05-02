import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import api from "./routes/api";
import config from "./config";

const app = express();

app.use(helmet());
app.use(cors({ origin: config.ALLOWED_ORIGINS, credentials: true }));

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

export default app;
