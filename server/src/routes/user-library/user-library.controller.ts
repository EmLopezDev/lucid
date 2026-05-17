import { type NextFunction, type Request, type Response } from "express";
import * as z from "zod";
import {
    GetUserLibraryParams,
    PatchUserLibraryGameBody,
    PostUserLibraryGameBody,
    UserLibraryGameIdParams,
} from "../../../../packages/types/UserLibrary";
import {
    getUserLibrary,
    createUserLibraryGame,
    updateUserLibraryGame,
    deleteUserLibraryGame,
} from "../../models/user-library/user-library.model";

export const getUserLibraryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = GetUserLibraryParams.safeParse(req.params);
        if (!parsed.success) {
            return res
                .status(400)
                .json({ message: "Invalid params", errors: z.flattenError(parsed.error) });
        }

        const games = await getUserLibrary(parsed.data.userId);
        res.status(200).json(games);
    } catch (error) {
        next(error);
    }
};

export const postUserLibraryGameController = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const parsedParams = GetUserLibraryParams.safeParse(req.params);
        if (!parsedParams.success) {
            return res
                .status(400)
                .json({ message: "Invalid params", errors: z.flattenError(parsedParams.error) });
        }

        const parsedBody = PostUserLibraryGameBody.safeParse(req.body);
        if (!parsedBody.success) {
            return res
                .status(400)
                .json({ message: "Invalid fields", errors: z.flattenError(parsedBody.error) });
        }

        const game = await createUserLibraryGame(parsedParams.data.userId, parsedBody.data);
        res.status(201).json(game);
    } catch (error) {
        next(error);
    }
};

export const patchUserLibraryGameController = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const parsedParams = UserLibraryGameIdParams.safeParse(req.params);
        if (!parsedParams.success) {
            return res
                .status(400)
                .json({ message: "Invalid params", errors: z.flattenError(parsedParams.error) });
        }

        const parsedBody = PatchUserLibraryGameBody.safeParse(req.body);
        if (!parsedBody.success) {
            return res
                .status(400)
                .json({ message: "Invalid fields", errors: z.flattenError(parsedBody.error) });
        }

        const { userId, gameId } = parsedParams.data;
        const updated = await updateUserLibraryGame(userId, gameId, parsedBody.data);

        if (!updated) {
            return res.status(404).json({ message: "Game not found" });
        }

        res.status(200).json(updated);
    } catch (error) {
        next(error);
    }
};

export const deleteUserLibraryGameController = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const parsed = UserLibraryGameIdParams.safeParse(req.params);
        if (!parsed.success) {
            return res
                .status(400)
                .json({ message: "Invalid params", errors: z.flattenError(parsed.error) });
        }

        const { userId, gameId } = parsed.data;
        const deleted = await deleteUserLibraryGame(userId, gameId);

        if (!deleted) {
            return res.status(404).json({ message: "Game not found" });
        }

        res.status(200).json({ _id: gameId });
    } catch (error) {
        next(error);
    }
};
