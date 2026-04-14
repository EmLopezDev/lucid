import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import api from "./routes/api";

const app = express();

app.use(helmet());
// TODO: Change wildcard to actual URLs
app.use(cors({ origin: ["*"], credentials: true }));

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

app.use(express.json());

app.use("/v1", api);

export default app;
