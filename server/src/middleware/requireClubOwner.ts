import { type Request, type Response, type NextFunction } from "express";
import { getGamingClubById } from "../models/club/club.model";

export const requireClubOwner = async (
    req: Request<{ clubId: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const club = await getGamingClubById(req.params.clubId, res.locals.userId);
        if (!club) {
            return res.status(404).json({ message: "Club not found" });
        }
        if (club.owner !== res.locals.userId) {
            return res.status(403).json({ message: "Only the club owner can do this" });
        }
        res.locals.club = club;
        next();
    } catch (error) {
        next(error);
    }
};
