import http from "http";

const server = http.createServer();

const PORT = 8000;

server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
