import { type Request, type Response, type NextFunction } from "express";
import { flattenError } from "zod";
import {
    getGamingClubPostById,
    getAllGamingClubPosts,
    createGamingClubPost,
    updateGamingClubPost,
    deleteGamingClubPost,
} from "../../models/club-post/club-post.model";
import {
    CreateClubPost,
    UpdateClubPost,
} from "../../../../packages/types/ClubPostTypes";

export const getGamingClubPost = async (
    req: Request<{ postId: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const post = await getGamingClubPostById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};

export const getGamingClubPosts = async (
    req: Request<{ clubId: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const posts = await getAllGamingClubPosts(req.params.clubId);
        return res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
};

export const postGamingClubPost = async (
    req: Request<{ clubId: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const parsed = CreateClubPost.safeParse(req.body);
        if (!parsed.success) {
            return res
                .status(400)
                .json({ message: "Invalid fields", errors: flattenError(parsed.error) });
        }
        const post = await createGamingClubPost(req.params.clubId, res.locals.userId, parsed.data);
        return res.status(201).json(post);
    } catch (error) {
        next(error);
    }
};

export const patchGamingClubPost = async (
    req: Request<{ postId: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const parsed = UpdateClubPost.safeParse(req.body);
        if (!parsed.success) {
            return res
                .status(400)
                .json({ message: "Invalid fields", errors: flattenError(parsed.error) });
        }
        const post = await updateGamingClubPost(req.params.postId, parsed.data);
        return res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};

export const destroyGamingClubPost = async (
    req: Request<{ postId: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        await deleteGamingClubPost(req.params.postId);
        return res.status(204).end();
    } catch (error) {
        next(error);
    }
};
