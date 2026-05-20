import express from "express";
import { searchGamesController } from "./games.controller";
import { requireAuth } from "../../middleware/requireAuth";

const GamesRouter = express.Router();

GamesRouter.use(requireAuth);

GamesRouter.get("/search", searchGamesController);

export default GamesRouter;
