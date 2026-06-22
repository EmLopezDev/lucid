import * as z from "zod";

export const GamingClubPost = z.object({
    _id: z.string(),
    author: z.string(),
    club_id: z.string(),
    content: z.string().max(1000),
    is_spoiler: z.boolean().default(false),
    created_at: z.string(),
    updated_at: z.string().nullable().default(null),
    deleted_at: z.string().nullable().default(null),
});

export type GamingClubPostType = z.infer<typeof GamingClubPost>;

export const CreateGamingClubPost = GamingClubPost.pick({
    content: true,
    is_spoiler: true,
});

export type CreateGamingClubPostType = z.infer<typeof CreateGamingClubPost>;

export const UpdateGamingClubPost = GamingClubPost.pick({
    content: true,
    is_spoiler: true,
}).partial();

export type UpdateGamingClubPostType = z.infer<typeof UpdateGamingClubPost>;
