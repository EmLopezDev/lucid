import { Schema, model } from "mongoose";
import { type ClubType } from "../../../../packages/types/ClubTypes";

type ClubDocument = Omit<
    ClubType,
    "current_game" | "past_games" | "created_at" | "updated_at" | "deleted_at" | "members"
> & {
    members: Array<{ user_id: string; joined_at: Date }>;
    current_game: {
        title: string;
        cover_url: string | null;
        start_date: Date | null;
        end_date: Date | null;
    } | null;
    past_games: Array<{
        title: string;
        cover_url: string | null;
        end_date: Date;
    }>;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
};

const ClubSchema = new Schema<ClubDocument>(
    {
        name: { type: String, required: true },
        owner: { type: String, required: true },
        avatar_url: { type: String, default: null },
        description: { type: String, default: null },
        members: [
            {
                type: {
                    user_id: { type: String, required: true },
                    joined_at: { type: Date, required: true },
                },
            },
        ],
        visibility: { type: String, required: true },
        invite_code: { type: String, default: null },
        current_game: {
            type: {
                title: { type: String, required: true },
                cover_url: { type: String, default: null },
                start_date: { type: Date, default: null },
                end_date: { type: Date, default: null },
            },
            default: null,
        },
        past_games: [
            {
                type: {
                    title: { type: String, required: true },
                    cover_url: { type: String, default: null },
                    end_date: { type: Date, required: true },
                },
            },
        ],
        created_at: { type: Date, required: true },
        updated_at: { type: Date, default: null },
        deleted_at: { type: Date, default: null },
    },
    { versionKey: false },
);

export const ClubModel = model<ClubDocument>("GamingClub", ClubSchema);
