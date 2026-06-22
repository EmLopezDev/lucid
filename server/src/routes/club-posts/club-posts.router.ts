import express from "express";
import {
    getGamingClubPost,
    getGamingClubPosts,
    postGamingClubPost,
    patchGamingClubPost,
    destroyGamingClubPost,
} from "./club-posts.controller";

const ClubPostRouter = express.Router();

ClubPostRouter.get("/posts", getGamingClubPosts);
ClubPostRouter.get("/posts/:postId", getGamingClubPost);
ClubPostRouter.post("/posts", postGamingClubPost);
ClubPostRouter.patch("/posts/:postId", patchGamingClubPost);
ClubPostRouter.delete("/posts/:postId", destroyGamingClubPost);

export default ClubPostRouter;
