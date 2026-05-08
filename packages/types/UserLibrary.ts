import * as z from "zod";

export const Status = z.literal(["playing", "completed", "paused", "dropped", "wishlist"]);

export type StatusType = z.infer<typeof Status>;

export const Platform = z.literal(["playstation", "xbox", "nintendo", "PC"]);

export type PlatformType = z.infer<typeof Platform>;

export const Genre = z.literal([
    "role-playing",
    "action adventure",
    "survival",
    "shooter",
    "strategy",
    "simulation",
    "battle royal",
    "sport",
    "racing",
    "platform",
    "puzzle",
    "other",
]);

export type GenreType = z.infer<typeof Genre>;

export const UserLibraryData = z.object({
    _id: z.uuid(),
    user_id: z.uuid(),
    title: z.string(),
    genre: Genre,
    platform: Platform,
    favorite: z.boolean().default(false),
    date_played: z.string().nullable().default(null),
    date_purchased: z.string().nullable().default(null),
    hours_played: z.number().min(0).nullable().default(null),
    rating: z.coerce
        .number()
        .min(0)
        .max(5)
        .refine((n) => (n.toString().split(".")[1]?.length ?? 0) <= 2, {
            message: "Max 2 decimal places allowed",
        })
        .nullable()
        .default(null),
    comment: z.string().nullable().default(null),
    status: Status,
    price: z.string().nullable().default(null),
    created_at: z.string(),
    updated_at: z.string().nullable().default(null),
    deleted_at: z.string().nullable().default(null),
});

export type UserLibraryDataType = z.infer<typeof UserLibraryData>;

export const GetUserLibraryParams = z.object({
    userId: z.string().regex(/^[a-f0-9]{24}$/),
});

export const UserLibraryGameIdParams = z.object({
    userId: z.string().regex(/^[a-f0-9]{24}$/),
    gameId: z.string().regex(/^[a-f0-9]{24}$/),
});

export const PatchUserLibraryGameBody = z
    .object({
        title: z.string().max(200),
        genre: Genre,
        platform: Platform,
        favorite: z.boolean(),
        date_played: z.string().nullable(),
        date_purchased: z.string().nullable(),
        hours_played: z.number().min(0).nullable(),
        rating: z.number().min(0).max(5).nullable(),
        comment: z.string().max(200).nullable(),
        status: Status,
        price: z.string().max(200).nullable(),
    })
    .partial();

export type PatchUserLibraryGameBodyType = z.infer<typeof PatchUserLibraryGameBody>;

export const PostUserLibraryGameBody = z.object({
    title: z.string().max(200),
    genre: Genre,
    platform: Platform,
    status: Status,
    favorite: z.boolean().default(false),
    date_played: z.string().nullable().default(null),
    date_purchased: z.string().nullable().default(null),
    hours_played: z.number().min(0).nullable().default(null),
    rating: z.number().min(0).max(5).nullable().default(null),
    comment: z.string().max(200).nullable().default(null),
    price: z.string().max(200).nullable().default(null),
});

export type PostUserLibraryGameBodyType = z.infer<typeof PostUserLibraryGameBody>;
