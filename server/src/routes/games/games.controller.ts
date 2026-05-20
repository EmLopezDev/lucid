import { type Request, type Response, type NextFunction } from "express";
import * as z from "zod";
import { flattenError } from "zod";
import { searchGame } from "../../services/rawg";

const SearchQuery = z.object({
    q: z.string().min(2).max(100),
});

export const searchGamesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = SearchQuery.safeParse(req.query);
        if (!parsed.success) {
            return res
                .status(400)
                .json({ message: "Invalid query", errors: flattenError(parsed.error) });
        }
        const results = await searchGame(parsed.data.q);
        res.status(200).json(results);
    } catch (error) {
        next(error);
    }
};
