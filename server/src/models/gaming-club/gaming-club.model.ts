import { randomBytes } from "crypto";
import { Types } from "mongoose";
import {
    type PostGamingClubType,
    type PatchGamingClubType,
} from "../../../../packages/types/GamingClubTypes";
import { GamingClubModel } from "./gaming-club.mongo";

export const getGamingClubById = async (clubId: string) => {
    const results = await GamingClubModel.aggregate([
        { $match: { _id: new Types.ObjectId(clubId) } },

        // Extract user_ids from members array for the lookup
        {
            $addFields: {
                _member_ids: { $map: { input: "$members", as: "m", in: "$$m.user_id" } },
            },
        },

        // Lookup user profiles
        {
            $lookup: {
                from: "users",
                let: { uids: "$_member_ids" },
                pipeline: [
                    { $match: { $expr: { $in: [{ $toString: "$_id" }, "$$uids"] } } },
                    { $project: { _id: 1, first_name: 1, last_name: 1 } },
                ],
                as: "_user_profiles",
            },
        },

        // Merge user profiles with joined_at, drop members with no profile
        {
            $addFields: {
                members: {
                    $filter: {
                        input: {
                            $map: {
                                input: "$members",
                                as: "m",
                                in: {
                                    $let: {
                                        vars: {
                                            profile: {
                                                $first: {
                                                    $filter: {
                                                        input: "$_user_profiles",
                                                        as: "u",
                                                        cond: {
                                                            $eq: [
                                                                { $toString: "$$u._id" },
                                                                "$$m.user_id",
                                                            ],
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        in: {
                                            $cond: [
                                                { $gt: ["$$profile", null] },
                                                {
                                                    $mergeObjects: [
                                                        "$$profile",
                                                        { joined_at: "$$m.joined_at" },
                                                    ],
                                                },
                                                null,
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                        as: "member",
                        cond: { $ne: ["$$member", null] },
                    },
                },
            },
        },

        // Remove temporary fields
        { $project: { _member_ids: 0, _user_profiles: 0 } },

        // Join posts
        {
            $lookup: {
                from: "gamingclubposts",
                let: { cid: { $toString: "$_id" } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$club_id", "$$cid"] },
                                    { $eq: ["$deleted_at", null] },
                                ],
                            },
                        },
                    },
                    { $sort: { created_at: -1 } },
                ],
                as: "posts",
            },
        },
    ]);
    return results[0] ?? null;
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
        members: [{ user_id: userId, joined_at: new Date() }],
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
        { _id: clubId, "members.user_id": { $ne: userId } },
        { $push: { members: { user_id: userId, joined_at: new Date() } } },
        { returnDocument: "after" },
    );
};

export const leaveGamingClub = async (userId: string, clubId: string) => {
    return await GamingClubModel.findOneAndUpdate(
        { _id: clubId },
        { $pull: { members: { user_id: userId } } },
        { returnDocument: "after" },
    );
};
