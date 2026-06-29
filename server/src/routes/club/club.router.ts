import express from "express";
import {
    getGamingClub,
    getGamingClubs,
    postGamingClub,
    patchGamingClub,
    destroyGamingClub,
    patchJoinGamingClub,
    patchLeaveGamingClub,
    patchSetGamingClubGame,
    patchGamingClubMember,
} from "./club.controller";
import { requireAuth } from "../../middleware/requireAuth";

const ClubRouter = express.Router();

ClubRouter.get("/", getGamingClubs);
ClubRouter.get("/:clubId", getGamingClub);
ClubRouter.post("/", requireAuth, postGamingClub);
ClubRouter.patch("/:clubId/game", requireAuth, patchSetGamingClubGame);
ClubRouter.patch("/:clubId/join", requireAuth, patchJoinGamingClub);
ClubRouter.patch("/:clubId/leave", requireAuth, patchLeaveGamingClub);
ClubRouter.patch("/:clubId/members/:memberId", requireAuth, patchGamingClubMember);
ClubRouter.patch("/:clubId", requireAuth, patchGamingClub);
ClubRouter.delete("/:clubId", requireAuth, destroyGamingClub);

export default ClubRouter;
