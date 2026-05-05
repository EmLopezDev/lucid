import { type NextFunction, type Request, type Response } from "express";
import * as z from "zod";
import UserLibraryMockData from "../../data/UserLibraryMockData";
import {
    GetUserLibraryParams,
    PatchUserLibraryGameBody,
    PostUserLibraryGameBody,
    UserLibraryGameIdParams,
    type UserLibraryDataType,
} from "../../../../packages/types/UserLibrary";

export const getUserLibrary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = GetUserLibraryParams.safeParse(req.params);
        if (!parsed.success) {
            res.status(400).json({ message: "Invalid params", errors: z.flattenError(parsed.error) });
            return;
        }

        const userLibraryData = UserLibraryMockData.filter(
            (data) => data.user_id === parsed.data.userId,
        );
        res.status(200).json(userLibraryData);
    } catch (error) {
        next(error);
    }
};

export const deleteUserLibraryGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = UserLibraryGameIdParams.safeParse(req.params);
        if (!parsed.success) {
            res.status(400).json({ message: "Invalid params", errors: z.flattenError(parsed.error) });
            return;
        }

        const { userId, gameId } = parsed.data;
        const index = UserLibraryMockData.findIndex(
            (data) => data._id === gameId && data.user_id === userId,
        );

        if (index === -1) {
            res.status(404).json({ message: "Game not found" });
            return;
        }

        UserLibraryMockData.splice(index, 1);
        res.status(200).json({ _id: gameId });
    } catch (error) {
        next(error);
    }
};

export const patchUserLibraryGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedParams = UserLibraryGameIdParams.safeParse(req.params);
        if (!parsedParams.success) {
            res.status(400).json({ message: "Invalid params", errors: parsedParams.error.flatten() });
            return;
        }

        const { userId, gameId } = parsedParams.data;
        const index = UserLibraryMockData.findIndex(
            (data) => data._id === gameId && data.user_id === userId,
        );

        if (index === -1) {
            res.status(404).json({ message: "Game not found" });
            return;
        }

        const parsedBody = PatchUserLibraryGameBody.safeParse(req.body);
        if (!parsedBody.success) {
            res.status(400).json({ message: "Invalid fields", errors: z.flattenError(parsedBody.error) });
            return;
        }

        const existing = UserLibraryMockData[index]!;
        UserLibraryMockData[index] = {
            ...existing,
            ...parsedBody.data,
            updated_at: new Date().toISOString().split("T")[0] as UserLibraryDataType["updated_at"],
        } as UserLibraryDataType;

        res.status(200).json(UserLibraryMockData[index]);
    } catch (error) {
        next(error);
    }
};

export const postUserLibraryGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedParams = GetUserLibraryParams.safeParse(req.params);
        if (!parsedParams.success) {
            res.status(400).json({ message: "Invalid params", errors: z.flattenError(parsedParams.error) });
            return;
        }

        const parsedBody = PostUserLibraryGameBody.safeParse(req.body);
        if (!parsedBody.success) {
            res.status(400).json({ message: "Invalid fields", errors: z.flattenError(parsedBody.error) });
            return;
        }

        const newGame: UserLibraryDataType = {
            _id: crypto.randomUUID(),
            user_id: parsedParams.data.userId,
            ...parsedBody.data,
            created_at: new Date().toISOString().split("T")[0] as UserLibraryDataType["created_at"],
            updated_at: null,
            deleted_at: null,
        };

        UserLibraryMockData.push(newGame);
        res.status(201).json(newGame);
    } catch (error) {
        next(error);
    }
};
