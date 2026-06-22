import * as z from "zod";

export const ClubPost = z.object({
    _id: z.string(),
    author: z.string(),
    club_id: z.string(),
    content: z.string().max(1000),
    is_spoiler: z.boolean().default(false),
    created_at: z.string(),
    updated_at: z.string().nullable().default(null),
    deleted_at: z.string().nullable().default(null),
});

export type ClubPostType = z.infer<typeof ClubPost>;

export const CreateClubPost = ClubPost.pick({
    content: true,
    is_spoiler: true,
});

export type CreateClubPostType = z.infer<typeof CreateClubPost>;

export const UpdateClubPost = ClubPost.pick({
    content: true,
    is_spoiler: true,
}).partial();

export type UpdateClubPostType = z.infer<typeof UpdateClubPost>;
