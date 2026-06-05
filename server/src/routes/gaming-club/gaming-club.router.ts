import express from "express";
import {
    getGamingClub,
    getGamingClubs,
    postGamingClub,
    patchGamingClub,
    destroyGamingClub,
    patchJoinGamingClub,
    patchLeaveGamingClub,
} from "./gaming-club.controller";

const GamingClubRouter = express.Router();

GamingClubRouter.get("/", getGamingClubs);
GamingClubRouter.get("/:clubId", getGamingClub);
GamingClubRouter.post("/", postGamingClub);
GamingClubRouter.patch("/:clubId/join", patchJoinGamingClub);
GamingClubRouter.patch("/:clubId/leave", patchLeaveGamingClub);
GamingClubRouter.patch("/:clubId", patchGamingClub);
GamingClubRouter.delete("/:clubId", destroyGamingClub);

export default GamingClubRouter;
