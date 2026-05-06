import mongoose from "mongoose";
import config from "../config";

mongoose.connection.once("open", () => {
    console.log("MongoDB connection ready!!");
});

mongoose.connection.on("error", (err) => {
    console.error(err);
});

export const mongoClientPromise = mongoose
    .connect(config.MONGO_URL)
    .then((m) => m.connection.getClient());

mongoClientPromise.catch((err) => {
    console.error("MongoDB connection failed:", err);
});

export async function mongoDisconnect() {
    await mongoose.disconnect();
}
