import express from "express";
import {
    getUserLibraryController,
    postUserLibraryGameController,
    deleteUserLibraryGameController,
    patchUserLibraryGameController,
} from "./user-library.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { requireOwner } from "../../middleware/requireOwner";

const UserLibraryRouter = express.Router({ mergeParams: true });

UserLibraryRouter.use(requireAuth);
UserLibraryRouter.use(requireOwner);

UserLibraryRouter.get("/library", getUserLibraryController);
UserLibraryRouter.post("/library", postUserLibraryGameController);
UserLibraryRouter.patch("/library/:gameId", patchUserLibraryGameController);
UserLibraryRouter.delete("/library/:gameId", deleteUserLibraryGameController);

export default UserLibraryRouter;
