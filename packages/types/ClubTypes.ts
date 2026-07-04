import * as z from "zod";
import { ClubPost } from "./ClubPostTypes";

const CurrentGame = z.object({
    title: z.string(),
    cover_url: z.string().nullable(),
    start_date: z.string().nullable().default(null),
    end_date: z.string().nullable().default(null),
});

const PastGame = z.object({
    title: z.string(),
    cover_url: z.string().nullable(),
    end_date: z.string(),
    game_status: z.enum(["completed", "dropped"]),
});

export const Club = z.object({
    _id: z.uuid(),
    name: z
        .string()
        .min(6, { error: "Must be a minimum of 6 characters" })
        .max(50, { error: "Exceeded maximum characters" })
        .regex(/^[^<>&"']+$/, { error: "Name contains invalid characters" }),
    owner: z.string(),
    avatar_url: z.string().nullable().default(null),
    description: z.string().max(160).nullable().default(null),
    members: z.array(z.object({ _id: z.string(), joined_at: z.string() })).default([]),
    visibility: z.enum(["public", "private"]),
    invite_code: z.string().nullable().default(null),
    invite_code_expires_at: z.string().nullable().default(null),
    current_game: CurrentGame.nullable().default(null),
    past_games: z.array(PastGame).default([]),
    created_at: z.string(),
    updated_at: z.string().nullable().default(null),
    deleted_at: z.string().nullable().default(null),
});

export type ClubType = z.infer<typeof Club>;

export const ClubMember = z.object({
    _id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    joined_at: z.string(),
});
export type ClubMemberType = z.infer<typeof ClubMember>;

export const ClubDetail = Club.omit({ members: true }).extend({
    members: z.array(ClubMember),
    posts: z.array(ClubPost),
});
export type ClubDetailType = z.infer<typeof ClubDetail>;

export const CreateClub = Club.pick({
    name: true,
    visibility: true,
}).extend({
    avatar_url: Club.shape.avatar_url.optional(),
    description: Club.shape.description.optional(),
});

export type CreateClubType = z.infer<typeof CreateClub>;

export const SetClubGame = z.object({
    title: z.string(),
    cover_url: z.string().nullable().optional(),
    start_date: z.string().nullable().optional(),
    end_date: z.string().nullable().optional(),
    game_status: z.enum(["completed", "dropped"]).optional(),
});

export type SetClubGameType = z.infer<typeof SetClubGame>;

export const UpdateClub = Club.pick({
    name: true,
    avatar_url: true,
    description: true,
    visibility: true,
}).partial();

export type UpdateClubType = z.infer<typeof UpdateClub>;

export const ClubInvitePreview = z.object({
    name: z.string(),
    avatar_url: z.string().nullable(),
    owner: z.object({
        first_name: z.string(),
        last_name: z.string(),
    }),
    member_count: z.number(),
    is_member: z.boolean(),
});
export type ClubInvitePreviewType = z.infer<typeof ClubInvitePreview>;
