import http from "http";
import app from "./app";
import config from "./config";
import { mongoClientPromise } from "./services/mongo";

const server = http.createServer(app);

const PORT = config.PORT;

const startServer = async () => {
    await mongoClientPromise;
    server.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
    });
};

startServer();
