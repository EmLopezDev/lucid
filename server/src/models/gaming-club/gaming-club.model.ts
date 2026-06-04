import {
    type PostGamingClubType,
    type PatchGamingClubType,
} from "../../../../packages/types/GamingClubTypes";
import { GamingClubModel } from "./gaming-club.mongo";

export const getAllGamingClubs = async () => {
    return await GamingClubModel.find({ deleted_at: null });
};

export const createGamingClub = async (userId: string, data: PostGamingClubType) => {
    return await GamingClubModel.create({
        owner: userId,
        name: data.name,
        visibility: data.visibility,
        avatar_url: data.avatar_url ?? null,
        description: data.description ?? null,
        created_at: new Date(),
    });
};

export const updateGamingClub = async (clubId: string, data: PatchGamingClubType) => {
    return await GamingClubModel.findOneAndUpdate(
        { _id: clubId },
        { ...data, updated_at: new Date() },
        { returnDocument: "after" },
    );
};

export const deleteGamingClub = async (clubId: string) => {
    return await GamingClubModel.findOneAndUpdate({ _id: clubId }, { deleted_at: new Date() });
};
