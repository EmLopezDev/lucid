import { randomBytes } from "crypto";
import {
    type PostGamingClubType,
    type PatchGamingClubType,
} from "../../../../packages/types/GamingClubTypes";
import { GamingClubModel } from "./gaming-club.mongo";

export const getGamingClubById = async (clubId: string) => {
    return await GamingClubModel.findOne({ _id: clubId });
};

export const getAllGamingClubs = async () => {
    return await GamingClubModel.find({ visibility: "public", deleted_at: null }).sort({
        created_at: -1,
    });
};

export const createGamingClub = async (userId: string, data: PostGamingClubType) => {
    return await GamingClubModel.create({
        owner: userId,
        name: data.name,
        visibility: data.visibility,
        avatar_url: data.avatar_url ?? null,
        description: data.description ?? null,
        invite_code: data.visibility === "private" ? randomBytes(6).toString("hex") : null,
        created_at: new Date(),
        members: [userId],
    });
};

export const updateGamingClub = async (clubId: string, data: PatchGamingClubType) => {
    const updateData: Record<string, unknown> = {
        ...data,
        updated_at: new Date(),
    };

    if (data.visibility === "private") {
        updateData.invite_code = randomBytes(6).toString("hex");
    } else if (data.visibility === "public") {
        updateData.invite_code = null;
    }

    return await GamingClubModel.findOneAndUpdate({ _id: clubId }, updateData, {
        returnDocument: "after",
    });
};

export const deleteGamingClub = async (clubId: string) => {
    return await GamingClubModel.findOneAndUpdate({ _id: clubId }, { deleted_at: new Date() });
};

export const joinGamingClub = async (userId: string, clubId: string) => {
    return await GamingClubModel.findOneAndUpdate(
        { _id: clubId },
        { $addToSet: { members: userId } },
        { returnDocument: "after" },
    );
};

export const leaveGamingClub = async (userId: string, clubId: string) => {
    return await GamingClubModel.findOneAndUpdate(
        { _id: clubId },
        { $pull: { members: userId } },
        { returnDocument: "after" },
    );
};
