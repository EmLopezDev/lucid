import { type Request, type Response, type NextFunction } from "express";
import { flattenError } from "zod";
import { UpdateClub, CreateClub, SetClubGame } from "../../../../packages/types/ClubTypes";
import {
    getGamingClubById,
    getAllGamingClubs,
    createGamingClub,
    updateGamingClub,
    deleteGamingClub,
    joinGamingClub,
    leaveGamingClub,
    setGamingClubGame,
    removeGamingClubMember,
    getClubInvitePreview,
    regenerateClubInviteCode,
} from "../../models/club/club.model";

export const getGamingClub = async (
    req: Request<{ clubId: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.session.userId;
        const club = await getGamingClubById(req.params.clubId, userId);
        if (!club) {
            return res.status(404).json({ message: "Club not found" });
        }
        if (club.visibility === "private") {
            const isMember = club.members.some((m) => m._id === userId);
            if (!isMember) return res.status(403).json({ message: "This club is private" });
        }

        return res.status(200).json(club);
    } catch (error) {
        next(error);
    }
};

export const getGamingClubs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.session.userId ?? "";
        const clubs = await getAllGamingClubs(userId);
        return res.status(200).json(clubs);
    } catch (error) {
        next(error);
    }
};

export const postGamingClub = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = CreateClub.safeParse(req.body);
        if (!parsed.success) {
            return res
                .status(400)
                .json({ message: "Invalid fields", errors: flattenError(parsed.error) });
        }
        const club = await createGamingClub(res.locals.userId, parsed.data);
        return res.status(201).json(club);
    } catch (error) {
        next(error);
    }
};

export const patchGamingClub = async (
    req: Request<{ clubId: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const parsed = UpdateClub.safeParse(req.body);
        if (!parsed.success) {
            return res
                .status(400)
                .json({ message: "Invalid fields", errors: flattenError(parsed.error) });
        }
        await updateGamingClub(req.params.clubId, parsed.data);
        const club = await getGamingClubById(req.params.clubId, res.locals.userId);
        return res.status(200).json(club);
    } catch (error) {
        next(error);
    }
};

export const patchJoinGamingClub = async (
    req: Request<{ clubId: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await joinGamingClub(
            res.locals.userId,
            req.params.clubId,
            req.body?.invite_code,
        );
        if (!result) return res.status(404).json({ message: "Club not found" });
        if (result === "invalid_code")
            return res.status(403).json({ message: "Invalid invite code" });

        const clubJoined = await getGamingClubById(req.params.clubId, res.locals.userId);
        return res.status(200).json(clubJoined); // covers both new join and already_member
    } catch (error) {
        next(error);
    }
};

export const patchSetGamingClubGame = async (
    req: Request<{ clubId: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { club } = res.locals;
        if (club.current_game && !req.body.game_status) {
            return res
                .status(400)
                .json({ message: "game_status is required when changing an existing game" });
        }
        const parsed = SetClubGame.safeParse(req.body);
        if (!parsed.success) {
            return res
                .status(400)
                .json({ message: "Invalid fields", errors: flattenError(parsed.error) });
        }
        await setGamingClubGame(req.params.clubId, parsed.data);
        const updated = await getGamingClubById(req.params.clubId, res.locals.userId);
        return res.status(200).json(updated);
    } catch (error) {
        next(error);
    }
};

export const patchLeaveGamingClub = async (
    req: Request<{ clubId: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const left = await leaveGamingClub(res.locals.userId, req.params.clubId);

        if (!left) {
            return res.status(404).json({ message: "Club not found" });
        }

        const clubLeft = await getGamingClubById(req.params.clubId, res.locals.userId);
        return res.status(200).json(clubLeft);
    } catch (error) {
        next(error);
    }
};

export const patchGamingClubMember = async (
    req: Request<{ clubId: string; memberId: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        await removeGamingClubMember(req.params.memberId, req.params.clubId);
        const removedMemberClub = await getGamingClubById(req.params.clubId, res.locals.userId);
        return res.status(200).json(removedMemberClub);
    } catch (error) {
        next(error);
    }
};

export const destroyGamingClub = async (
    req: Request<{ clubId: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        await deleteGamingClub(req.params.clubId);
        return res.status(204).end();
    } catch (error) {
        next(error);
    }
};

export const getGamingClubInvite = async (
    req: Request<{ clubId: string }, unknown, unknown, { code?: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { code } = req.query;
        if (!code) return res.status(400).json({ message: "Invite code is required" });

        const preview = await getClubInvitePreview(req.params.clubId, req.session.userId ?? "", code);
        if (!preview) return res.status(404).json({ message: "Invalid invite link" });

        return res.status(200).json(preview);
    } catch (error) {
        next(error);
    }
};

export const patchRegenerateClubInviteCode = async (
    req: Request<{ clubId: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        await regenerateClubInviteCode(req.params.clubId);
        const club = await getGamingClubById(req.params.clubId, res.locals.userId);
        return res.status(200).json(club);
    } catch (error) {
        next(error);
    }
};
