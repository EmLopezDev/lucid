import express from "express";
import { getUserLibrary, postUserLibraryGame, deleteUserLibraryGame, patchUserLibraryGame } from "./user-library.controller";

const UserLibraryRouter = express.Router({ mergeParams: true });

UserLibraryRouter.get("/:userId/library", getUserLibrary);
UserLibraryRouter.post("/:userId/library", postUserLibraryGame);
UserLibraryRouter.patch("/:userId/library/:gameId", patchUserLibraryGame);
UserLibraryRouter.delete("/:userId/library/:gameId", deleteUserLibraryGame);

export default UserLibraryRouter;
