import express from "express";
import AuthRouter from "./auth/auth.router";
import UserLibraryRouter from "./user-library/user-library.router";

const api = express.Router();

api.use("/auth", AuthRouter);
api.use("/user/:userId", UserLibraryRouter);

export default api;
