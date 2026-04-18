import * as z from "zod";

export const UserLibraryData = z.object({
    _id: z.uuid(),
    user_id: z.uuid(),
    game_id: z.bigint(),
    game_title: z.string(),
    game_platform: z.literal(["PC", "Playstation", "Xbox", "Switch"]),
    favorite: z.boolean().default(false),
    date_played: z.date().nullable().default(null),
    date_purchased: z.date().nullable().default(null),
    rating: z.literal(["goat", "loved", "liked", "alright", "hated"]).nullable().default(null),
    rating_comment: z.string().nullable().default(null),
    status: z
        .literal(["finished", "currently playing", "want to play", "did not finish"])
        .nullable()
        .default(null),
});

export type UserLibraryDataType = z.infer<typeof UserLibraryData>;
