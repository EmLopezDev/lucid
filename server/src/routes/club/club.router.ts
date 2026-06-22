import express from "express";
import {
    getGamingClub,
    getGamingClubs,
    postGamingClub,
    patchGamingClub,
    destroyGamingClub,
    patchJoinGamingClub,
    patchLeaveGamingClub,
} from "./club.controller";

const ClubRouter = express.Router();

ClubRouter.get("/", getGamingClubs);
ClubRouter.get("/:clubId", getGamingClub);
ClubRouter.post("/", postGamingClub);
ClubRouter.patch("/:clubId/join", patchJoinGamingClub);
ClubRouter.patch("/:clubId/leave", patchLeaveGamingClub);
ClubRouter.patch("/:clubId", patchGamingClub);
ClubRouter.delete("/:clubId", destroyGamingClub);

export default ClubRouter;
