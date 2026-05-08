import "./services/sentry";
import http from "http";
import app from "./app";
import config from "./config";
import logger from "./services/logger";
import { mongoClientPromise } from "./services/mongo";

const server = http.createServer(app);

const PORT = config.PORT;

const startServer = async () => {
    await mongoClientPromise;
    server.listen(PORT, () => {
        logger.info(`Listening on port: ${PORT}`);
    });
};

startServer();
