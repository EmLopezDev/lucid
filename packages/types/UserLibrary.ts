import * as z from "zod";

export const Status = z
    .literal(["playing", "paused", "completed", "wishlist"])
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
    purchase_amount: z
        .string()
        .regex(/^(0|[1-9]\d*)\.\d{2}$/, {
            message: "Must be an amount with two decimals",
        })
        .refine((val) => parseFloat(val) > 0, { message: "Money amount must be greater than 0" })
        .nullable()
        .default(null),
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
});

export type UserLibraryDataType = z.infer<typeof UserLibraryData>;
