import mongoose from "mongoose";
import config from "../config";
import logger from "./logger";

mongoose.connection.once("open", () => {
    logger.info("MongoDB connection ready!!");
});

mongoose.connection.on("error", (err) => {
    logger.error(err);
});

export const mongoClientPromise = mongoose
    .connect(config.MONGO_URL)
    .then((m) => m.connection.getClient());

mongoClientPromise.catch((err) => {
    logger.error("MongoDB connection failed:", err);
});

export async function mongoDisconnect() {
    await mongoose.disconnect();
}
