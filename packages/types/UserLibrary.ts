import * as z from "zod";

export const Status = z
    .literal(["playing", "paused", "completed", "dropped", "wishlist"])
    .nullable()
    .default(null);

export type Status = z.infer<typeof Status>;

const WishList = z.object({
    type: z.literal(["wishlist"]),
});

const Own = z.object({
    type: z.literal(["own"]),
    date_played: z.date().nullable().default(null),
    date_purchased: z.date().nullable().default(null),
});

export const UserLibraryData = z.object({
    _id: z.uuid(),
    user_id: z.uuid(),
    game_id: z.bigint(),
    title: z.string(),
    genre: z.string(),
    platform: z.literal(["PC", "Playstation", "Xbox", "Switch"]),
    favorite: z.boolean().default(false),
    ownership: z.discriminatedUnion("type", [WishList, Own]),
    rating: z.literal(["goat", "loved", "liked", "alright", "hated"]).nullable().default(null),
    rating_comment: z.string().nullable().default(null),
    status: Status,
    price: z.string().nullable().default(null),
});

export type UserLibraryDataType = z.infer<typeof UserLibraryData>;
