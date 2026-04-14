import express from "express";
import authRouter from "./auth/authRouter";

const api = express.Router();

api.use("/auth", authRouter);

export default api;
