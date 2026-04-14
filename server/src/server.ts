import http from "http";
import app from "./app";

const server = http.createServer(app);

const PORT = 8000;

const startServer = () => {
    server.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
    });
};

startServer();
