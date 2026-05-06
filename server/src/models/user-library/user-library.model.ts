import {
    type PostUserLibraryGameBodyType,
    type PatchUserLibraryGameBodyType,
} from "../../../../packages/types/UserLibrary";
import { UserLibraryModel } from "./user-library.mongo";

export const getUserLibrary = async (userId: string) => {
    return await UserLibraryModel.find({ user_id: userId, deleted_at: null });
};

export const createUserLibraryGame = async (userId: string, data: PostUserLibraryGameBodyType) => {
    return await UserLibraryModel.create({
        user_id: userId,
        ...data,
        created_at: new Date(),
    });
};

export const updateUserLibraryGame = async (
    userId: string,
    gameId: string,
    data: PatchUserLibraryGameBodyType,
) => {
    return await UserLibraryModel.findOneAndUpdate(
        { _id: gameId, user_id: userId },
        { ...data, updated_at: new Date() },
        { new: true },
    );
};

export const deleteUserLibraryGame = async (userId: string, gameId: string) => {
    return await UserLibraryModel.findOneAndDelete({ _id: gameId, user_id: userId });
};
