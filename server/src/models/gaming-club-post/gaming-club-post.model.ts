import {
    type CreateGamingClubPostType,
    type UpdateGamingClubPostType,
} from "../../../../packages/types/GamingClubPostTypes";
import { GamingClubPostModel } from "./gaming-club-post.mongo";

export const getAllGamingClubPosts = async (clubId: string) => {
    return await GamingClubPostModel.find({ club_id: clubId, deleted_at: null });
};

export const createGamingClubPost = async (
    clubId: string,
    userId: string,
    data: CreateGamingClubPostType,
) => {
    return await GamingClubPostModel.create({
        club_id: clubId,
        author: userId,
        ...data,
        created_at: new Date(),
    });
};

export const updateGamingClubPost = async (postId: string, data: UpdateGamingClubPostType) => {
    return await GamingClubPostModel.findOneAndUpdate(
        { _id: postId },
        { ...data, updated_at: new Date() },
        { returnDocument: "after" },
    );
};

export const deleteGamingClubPost = async (postId: string) => {
    return await GamingClubPostModel.findOneAndUpdate({ _id: postId }, { deleted_at: new Date() });
};
