import express from "express";
import AuthRouter from "./auth/auth.router";

const api = express.Router();

api.use("/auth", AuthRouter);

export default api;
