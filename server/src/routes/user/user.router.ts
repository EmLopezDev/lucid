import express from "express";
import { patchUser, patchPassword } from "./user.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { requireOwner } from "../../middleware/requireOwner";

const UserRouter = express.Router({ mergeParams: true });

UserRouter.use(requireAuth);
UserRouter.use(requireOwner);

UserRouter.patch("/", patchUser);
UserRouter.patch("/password", patchPassword);

export default UserRouter;
