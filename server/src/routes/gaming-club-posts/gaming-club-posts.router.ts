import express from "express";
import {
    getGamingClubPost,
    getGamingClubPosts,
    postGamingClubPost,
    patchGamingClubPost,
    destroyGamingClubPost,
} from "./gaming-club-posts.controller";

const GamingClubPostRouter = express.Router();

GamingClubPostRouter.get("/posts", getGamingClubPosts);
GamingClubPostRouter.get("/posts/:postId", getGamingClubPost);
GamingClubPostRouter.post("/posts", postGamingClubPost);
GamingClubPostRouter.patch("/posts/:postId", patchGamingClubPost);
GamingClubPostRouter.delete("/posts/:postId", destroyGamingClubPost);

export default GamingClubPostRouter;
