import mongoose from "mongoose";
import config from "../config";

const MONGO_URL = config.MONGO_URL;

mongoose.connection.once("open", () => {
    console.log("MongoDB connection ready!!");
});

mongoose.connection.on("error", (err) => {
    console.error(err);
});

export async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

export async function mongoDisconnect() {
    await mongoose.disconnect();
}
