import express from "express";
import { getUserLibrary, postUserLibraryGame, deleteUserLibraryGame, patchUserLibraryGame } from "./user-library.controller";

const UserLibraryRouter = express.Router({ mergeParams: true });

UserLibraryRouter.get("/library", getUserLibrary);
UserLibraryRouter.post("/library", postUserLibraryGame);
UserLibraryRouter.patch("/library/:gameId", patchUserLibraryGame);
UserLibraryRouter.delete("/library/:gameId", deleteUserLibraryGame);

export default UserLibraryRouter;
