import * as z from "zod";

export const Status = z.literal(["playing", "completed", "paused", "dropped", "wishlist"]);

export type StatusType = z.infer<typeof Status>;

export const Platform = z.literal(["playstation", "xbox", "nintendo", "PC"]);

export type PlatformType = z.infer<typeof Platform>;

export const UserLibraryData = z.object({
    _id: z.uuid(),
    user_id: z.uuid(),
    game_id: z.string(),
    title: z.string(),
    genre: z.string(),
    platform: Platform,
    favorite: z.boolean().default(false),
    date_played: z.date().nullable().default(null),
    date_purchased: z.date().nullable().default(null),
    hours_played: z.number().min(0).nullable().default(null),
    rating: z.coerce
        .number()
        .min(0)
        .max(5)
        .refine((n) => n.toString().split(".")[1]?.length <= 2, {
            message: "Max 2 decimal places allowed",
        })
        .nullable()
        .default(null),
    comment: z.string().nullable().default(null),
    status: Status,
    price: z.string().nullable().default(null),
    created_at: z.date(),
    updated_at: z.date().nullable().default(null),
    deleted_at: z.date().nullable().default(null),
});

export type UserLibraryDataType = z.infer<typeof UserLibraryData>;
