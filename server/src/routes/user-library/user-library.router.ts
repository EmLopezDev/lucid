import express from "express";
import { getUserLibrary, deleteUserLibraryGame } from "./user-library.controller";

const UserLibraryRouter = express.Router({ mergeParams: true });

UserLibraryRouter.get("/library", getUserLibrary);
UserLibraryRouter.delete("/library/:gameId", deleteUserLibraryGame);
// UserLibraryRouter.post("/library");
// UserLibraryRouter.patch("/library/:gameId");

export default UserLibraryRouter;
