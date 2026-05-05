import { type Request, type Response } from "express";
import UserLibraryMockData from "../../data/UserLibraryMockData";

// {
//     _id: crypto.randomUUID(),
//     user_id: userOneId,
//     game_id: generateRandomBigInt64(),
//     title: "The Last of Us",
//     platform: "playstation",
//     genre: "Action",
//     favorite: true,
//     ownership: { type: "wishlist" },
//     rating: 5,
//     hours_played: null,
//     comment: "Amazing game, loved every single second of it. Kept me on the edge of my seat",
//     status: "wishlist",
//     price: "39.99",
//     created_at: new Date("2021-05-15"),
//     updated_at: null,
//     deleted_at: null,
// },

export const getUserLibrary = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const userLibraryData = UserLibraryMockData.filter((data) => data.user_id === userId);
    res.status(200).json(userLibraryData);
};

export const deleteUserLibraryGame = async (req: Request, res: Response) => {
    const { userId, gameId } = req.params;
    const index = UserLibraryMockData.findIndex(
        (data) => data._id === gameId && data.user_id === userId,
    );

    if (index === -1) {
        res.status(404).json({ message: "Game not found" });
        return;
    }

    UserLibraryMockData.splice(index, 1);
    res.status(200).json({ _id: gameId });
};

export const postUserLibrary = async (req: Request, res: Response) => {};
