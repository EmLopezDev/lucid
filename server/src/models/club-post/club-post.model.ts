import {
    type CreateClubPostType,
    type UpdateClubPostType,
} from "../../../../packages/types/ClubPostTypes";
import { ClubPostModel } from "./club-post.mongo";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export const getAllGamingClubPosts = async (
    clubId: string,
    options?: { before?: string | undefined; limit?: number | undefined },
) => {
    const limit = Math.min(options?.limit || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
    const query: { club_id: string; deleted_at: null; created_at?: { $lt: Date } } = {
        club_id: clubId,
        deleted_at: null,
    };

    if (options?.before) {
        const cursorPost = await ClubPostModel.findOne({ _id: options.before });
        if (cursorPost) {
            query.created_at = { $lt: cursorPost.created_at };
        }
    }

    const posts = await ClubPostModel.find(query)
        .sort({ created_at: -1 })
        .limit(limit + 1);
    const hasMore = posts.length > limit;
    const page = hasMore ? posts.slice(0, limit) : posts;

    return { posts: page, nextCursor: hasMore ? String(page[page.length - 1]?._id) : null };
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
