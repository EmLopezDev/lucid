import type { IncomingMessage, ServerResponse } from "http";
import mongoose from "mongoose";
import app from "../server/src/app";
import { mongoConnect } from "../server/src/services/mongo";

let connectionPromise: Promise<void> | null = null;

const ensureConnected = () => {
    if (mongoose.connection.readyState === 1) return Promise.resolve();
    if (!connectionPromise) {
        connectionPromise = mongoConnect().catch((err) => {
            connectionPromise = null;
            throw err;
        });
    }
    return connectionPromise;
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    await ensureConnected();
    app(req, res);
}
