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
    getGamingClubInvite,
    patchRegenerateClubInviteCode,
} from "./club.controller";
import { inviteLimiter } from "../../middleware/rateLimiter";
import { requireAuth } from "../../middleware/requireAuth";
import { requireClubOwner } from "../../middleware/requireClubOwner";

const ClubRouter = express.Router();

ClubRouter.get("/", getGamingClubs);
ClubRouter.get("/:clubId", getGamingClub);
ClubRouter.get("/:clubId/invite", inviteLimiter, getGamingClubInvite);
ClubRouter.post("/", requireAuth, postGamingClub);
ClubRouter.patch("/:clubId/game", requireAuth, requireClubOwner, patchSetGamingClubGame);
ClubRouter.patch("/:clubId/join", requireAuth, inviteLimiter, patchJoinGamingClub);
ClubRouter.patch("/:clubId/leave", requireAuth, patchLeaveGamingClub);
ClubRouter.patch(
    "/:clubId/invite/regenerate",
    requireAuth,
    requireClubOwner,
    patchRegenerateClubInviteCode,
);
ClubRouter.patch(
    "/:clubId/members/:memberId",
    requireAuth,
    requireClubOwner,
    patchGamingClubMember,
);
ClubRouter.patch("/:clubId", requireAuth, requireClubOwner, patchGamingClub);
ClubRouter.delete("/:clubId", requireAuth, requireClubOwner, destroyGamingClub);

export default ClubRouter;
