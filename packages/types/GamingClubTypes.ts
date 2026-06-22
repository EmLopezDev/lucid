import * as z from "zod";
import { GamingClubPost } from "./GamingClubPostTypes";

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
});

export const GamingClub = z.object({
    _id: z.uuid(),
    name: z
        .string()
        .min(6, { error: "Must be a minimum of 6 characters" })
        .max(50, { error: "Exceeded maximum characters" })
        .regex(/^[^<>&"']+$/, { error: "Name contains invalid characters" }),
    owner: z.string(),
    avatar_url: z.string().nullable().default(null),
    description: z.string().max(160).nullable().default(null),
    members: z.array(z.object({ user_id: z.string(), joined_at: z.string() })).default([]),
    visibility: z.enum(["public", "private"]),
    invite_code: z.string().nullable().default(null),
    current_game: CurrentGame.nullable().default(null),
    past_games: z.array(PastGame).default([]),
    created_at: z.string(),
    updated_at: z.string().nullable().default(null),
    deleted_at: z.string().nullable().default(null),
});

export type GamingClubType = z.infer<typeof GamingClub>;

export const ClubMember = z.object({
    _id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    joined_at: z.string(),
});
export type ClubMemberType = z.infer<typeof ClubMember>;

export const GamingClubDetail = GamingClub.omit({ members: true }).extend({
    members: z.array(ClubMember),
    posts: z.array(GamingClubPost),
});
export type GamingClubDetailType = z.infer<typeof GamingClubDetail>;

export const PostGamingClub = GamingClub.pick({
    name: true,
    visibility: true,
}).extend({
    avatar_url: GamingClub.shape.avatar_url.optional(),
    description: GamingClub.shape.description.optional(),
});

export type PostGamingClubType = z.infer<typeof PostGamingClub>;

export const PatchGamingClub = GamingClub.pick({
    name: true,
    avatar_url: true,
    description: true,
    visibility: true,
    current_game: true,
}).partial();

export type PatchGamingClubType = z.infer<typeof PatchGamingClub>;
