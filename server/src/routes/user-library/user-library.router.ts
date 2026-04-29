import express from "express";
import { getUserLibrary } from "./user-library.controller";

const UserLibraryRouter = express.Router({ mergeParams: true });

UserLibraryRouter.get("/library", getUserLibrary);
// UserLibraryRouter.post("/");
// UserLibraryRouter.patch("/");
// UserLibraryRouter.delete("/");

export default UserLibraryRouter;
