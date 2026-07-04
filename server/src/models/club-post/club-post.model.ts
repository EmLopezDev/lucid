import {
    type CreateClubPostType,
    type UpdateClubPostType,
} from "../../../../packages/types/ClubPostTypes";
import { ClubPostModel } from "./club-post.mongo";

export const getAllGamingClubPosts = async (clubId: string) => {
    return await ClubPostModel.find({ club_id: clubId, deleted_at: null }).sort({ created_at: -1 });
};

export const getGamingClubPostById = async (postId: string) => {
    return await ClubPostModel.findOne({ _id: postId });
};

export const createGamingClubPost = async (
    clubId: string,
    userId: string,
    data: CreateClubPostType,
) => {
    return await ClubPostModel.create({
        club_id: clubId,
        author: userId,
        ...data,
        created_at: new Date(),
    });
};

export const updateGamingClubPost = async (postId: string, data: UpdateClubPostType) => {
    return await ClubPostModel.findOneAndUpdate(
        { _id: postId },
        { ...data, updated_at: new Date() },
        { returnDocument: "after" },
    );
};

export const deleteGamingClubPost = async (postId: string) => {
    return await ClubPostModel.findOneAndUpdate({ _id: postId }, { deleted_at: new Date() });
};
