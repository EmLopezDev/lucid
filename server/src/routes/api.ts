import express from "express";
import AuthRouter from "./auth/auth.router";
import UserLibraryRouter from "./user-library/user-library.router";
import UserRouter from "./user/user.router";
import GamesRouter from "./games/games.router";
import ClubRouter from "./club/club.router";
import ClubPostRouter from "./club-posts/club-posts.router";

const api = express.Router();

api.get("/health", (_req, res) => res.status(200).end());

api.use("/auth", AuthRouter);
api.use("/user/:userId", UserLibraryRouter);
api.use("/user/:userId", UserRouter);
api.use("/games", GamesRouter);
api.use("/clubs", ClubRouter);
api.use("/clubs/:clubId", ClubPostRouter);

export default api;
