import express from "express";
import {
    getGamingClubPost,
    getGamingClubPosts,
    postGamingClubPost,
    patchGamingClubPost,
    destroyGamingClubPost,
} from "./club-posts.controller";
import { requireAuth } from "../../middleware/requireAuth";

const ClubPostRouter = express.Router({ mergeParams: true });

ClubPostRouter.get("/posts", getGamingClubPosts);
ClubPostRouter.get("/posts/:postId", getGamingClubPost);
ClubPostRouter.post("/posts", requireAuth, postGamingClubPost);
ClubPostRouter.patch("/posts/:postId", requireAuth, patchGamingClubPost);
ClubPostRouter.delete("/posts/:postId", requireAuth, destroyGamingClubPost);

export default ClubPostRouter;
