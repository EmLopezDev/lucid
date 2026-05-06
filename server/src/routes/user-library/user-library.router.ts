import express from "express";
import {
    getUserLibraryController,
    postUserLibraryGameController,
    deleteUserLibraryGameController,
    patchUserLibraryGameController,
} from "./user-library.controller";

const UserLibraryRouter = express.Router({ mergeParams: true });

UserLibraryRouter.get("/:userId/library", getUserLibraryController);
UserLibraryRouter.post("/:userId/library", postUserLibraryGameController);
UserLibraryRouter.patch("/:userId/library/:gameId", patchUserLibraryGameController);
UserLibraryRouter.delete("/:userId/library/:gameId", deleteUserLibraryGameController);

export default UserLibraryRouter;
