import mongoose from "mongoose";
import app from "../server/src/app";
import { mongoConnect } from "../server/src/services/mongo";

if (mongoose.connection.readyState === 0) {
    mongoConnect();
}

export default app;
