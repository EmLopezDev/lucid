import express from "express";
import { getUserLibrary, deleteUserLibraryGame, patchUserLibraryGame } from "./user-library.controller";

const UserLibraryRouter = express.Router({ mergeParams: true });

UserLibraryRouter.get("/library", getUserLibrary);
UserLibraryRouter.patch("/library/:gameId", patchUserLibraryGame);
UserLibraryRouter.delete("/library/:gameId", deleteUserLibraryGame);
// UserLibraryRouter.post("/library");

export default UserLibraryRouter;
