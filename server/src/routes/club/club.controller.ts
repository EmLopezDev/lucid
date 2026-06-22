import { type Request, type Response, type NextFunction } from "express";
import { flattenError } from "zod";
import { UpdateClub, CreateClub } from "../../../../packages/types/ClubTypes";
import {
    getGamingClubById,
    getAllGamingClubs,
    createGamingClub,
    updateGamingClub,
    deleteGamingClub,
    joinGamingClub,
    leaveGamingClub,
} from "../../models/club/club.model";

export const getGamingClub = async (
    req: Request<{ clubId: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const club = await getGamingClubById(req.params.clubId);
        if (!club) {
            return res.status(404).json({ message: "Club not found" });
        }
        return res.status(200).json(club);
    } catch (error) {
        next(error);
    }
};

export const getGamingClubs = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const clubs = await getAllGamingClubs();
        return res.status(200).json(clubs);
    } catch (error) {
        next(error);
    }
};

export const postGamingClub = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const parsed = CreateClub.safeParse(req.body);
        if (!parsed.success) {
            return res
                .status(400)
                .json({ message: "Invalid fields", errors: flattenError(parsed.error) });
        }
        const club = await createGamingClub(req.session.userId, parsed.data);
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
        const club = await updateGamingClub(req.params.clubId, parsed.data);
        return res.status(200).json(club);
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

export const patchJoinGamingClub = async (
    req: Request<{ clubId: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const club = await getGamingClubById(req.params.clubId);

        if (!club) {
            return res.status(404).json({ message: "Club not found" });
        }

        if (club.visibility === "private") {
            if (req.body.invite_code !== club.invite_code) {
                return res.status(403).json({ message: "Invalid invite code" });
            }
        }
        const clubJoined = await joinGamingClub(req.session.userId, req.params.clubId);
        return res.status(200).json(clubJoined);
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
        if (!req.session.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const clubLeft = await leaveGamingClub(req.session.userId, req.params.clubId);

        if (!clubLeft) {
            return res.status(404).json({ message: "Club not found" });
        }

        return res.status(200).json(clubLeft);
    } catch (error) {
        next(error);
    }
};
