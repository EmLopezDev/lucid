import { randomBytes } from "crypto";
import { Types } from "mongoose";
import {
    type ClubDetailType,
    type CreateClubType,
    type UpdateClubType,
    type SetClubGameType,
    type ClubInvitePreviewType,
} from "../../../../packages/types/ClubTypes";
import { ClubModel } from "./club.mongo";

export const getGamingClubById = async (clubId: string, userId: string | undefined) => {
    const results = await ClubModel.aggregate<ClubDetailType>([
        { $match: { _id: new Types.ObjectId(clubId) } },

        // Extract member _ids for the lookup
        {
            $addFields: {
                _member_ids: { $map: { input: "$members", as: "m", in: "$$m._id" } },
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
                                                                "$$m._id",
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

        // Sort past_games newest first by end_date
        {
            $addFields: {
                past_games: {
                    $sortArray: { input: "$past_games", sortBy: { end_date: -1 } },
                },
            },
        },

        // Join posts
        {
            $lookup: {
                from: "clubposts",
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
        // strips invite code for non-owners
        {
            $addFields: {
                invite_code: {
                    $cond: [{ $eq: ["$owner", userId] }, "$invite_code", null],
                },
            },
        },
    ]);
    return results[0] ?? null;
};

export const getAllGamingClubs = async () => {
    return await ClubModel.find({ visibility: "public", deleted_at: null }).sort({
        created_at: -1,
    });
};

export const createGamingClub = async (userId: string, data: CreateClubType) => {
    return await ClubModel.create({
        owner: userId,
        name: data.name,
        visibility: data.visibility,
        avatar_url: data.avatar_url ?? null,
        description: data.description ?? null,
        invite_code: data.visibility === "private" ? randomBytes(6).toString("hex") : null,
        created_at: new Date(),
        members: [{ _id: userId, joined_at: new Date() }],
    });
};

export const updateGamingClub = async (clubId: string, data: UpdateClubType) => {
    const updateData: Record<string, unknown> = {
        ...data,
        updated_at: new Date(),
    };

    if (data.visibility === "private") {
        updateData.invite_code = randomBytes(6).toString("hex");
    } else if (data.visibility === "public") {
        updateData.invite_code = null;
    }

    return await ClubModel.findOneAndUpdate({ _id: clubId }, updateData, {
        returnDocument: "after",
    });
};

export const deleteGamingClub = async (clubId: string) => {
    return await ClubModel.findOneAndUpdate({ _id: clubId }, { deleted_at: new Date() });
};

export const joinGamingClub = async (userId: string, clubId: string, inviteCode?: string) => {
    const club = await ClubModel.findOne({ _id: clubId, deleted_at: null }).lean();
    if (!club) return null;

    if (club.visibility === "private") {
        if (club.invite_code !== inviteCode) return "invalid_code";
    }

    return await ClubModel.findOneAndUpdate(
        { _id: clubId, "members._id": { $ne: userId } },
        { $push: { members: { _id: userId, joined_at: new Date() } } },
        { returnDocument: "after" },
    );
};

export const setGamingClubGame = async (clubId: string, data: SetClubGameType) => {
    const club = await ClubModel.findById(clubId);
    if (!club) return null;

    const newGame = {
        title: data.title,
        cover_url: data.cover_url ?? null,
        start_date: data.start_date ? new Date(data.start_date) : null,
        end_date: data.end_date ? new Date(data.end_date) : null,
    };

    if (club.current_game && data.game_status) {
        return await ClubModel.findOneAndUpdate(
            { _id: clubId },
            {
                $set: { current_game: newGame, updated_at: new Date() },
                $push: {
                    past_games: {
                        title: club.current_game.title,
                        cover_url: club.current_game.cover_url,
                        end_date: new Date(),
                        game_status: data.game_status,
                    },
                },
            },
            { returnDocument: "after" },
        );
    }

    return await ClubModel.findOneAndUpdate(
        { _id: clubId },
        { $set: { current_game: newGame, updated_at: new Date() } },
        { returnDocument: "after" },
    );
};

export const leaveGamingClub = async (userId: string, clubId: string) => {
    return await ClubModel.findOneAndUpdate(
        { _id: clubId },
        { $pull: { members: { _id: userId } } },
        { returnDocument: "after" },
    );
};

export const removeGamingClubMember = async (memberId: string, clubId: string) => {
    return await ClubModel.findByIdAndUpdate(
        { _id: clubId },
        { $pull: { members: { _id: memberId } } },
        { returnDocument: "after" },
    );
};

export const getClubInvitePreview = async (clubId: string, userId: string, inviteCode: string) => {
    const results = await ClubModel.aggregate<ClubInvitePreviewType>([
        {
            $match: {
                _id: new Types.ObjectId(clubId),
                visibility: "private",
                invite_code: inviteCode,
            },
        },
        {
            $lookup: {
                from: "users",
                let: { ownerId: "$owner" },
                pipeline: [
                    { $match: { $expr: { $eq: [{ $toString: "$_id" }, "$$ownerId"] } } },
                    { $project: { _id: 0, first_name: 1, last_name: 1 } },
                ],
                as: "_owner",
            },
        },
        {
            $project: {
                _id: 0,
                name: 1,
                avatar_url: 1,
                owner: { $first: "$_owner" },
                is_member: { $in: [userId, "$members._id"] },
            },
        },
    ]);
    return results[0] ?? null;
};

export const regenerateClubInviteCode = async (clubId: string) => {
    return await ClubModel.findOneAndUpdate(
        { _id: clubId },
        { invite_code: randomBytes(6).toString("hex"), updated_at: new Date() },
        { returnDocument: "after" },
    );
};
