import express from "express";
import { patchUser, patchPassword, deleteUser, getProfile } from "./user.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { requireOwner } from "../../middleware/requireOwner";

const UserRouter = express.Router({ mergeParams: true });

UserRouter.use(requireAuth);
UserRouter.use(requireOwner);

UserRouter.get("/profile", getProfile);
UserRouter.patch("/", patchUser);
UserRouter.patch("/password", patchPassword);
UserRouter.delete("/", deleteUser);

export default UserRouter;
