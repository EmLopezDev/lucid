import { Schema, model } from "mongoose";
import { type GamingClubPostType } from "../../../../packages/types/GamingClubPostTypes";

type GamingClubDocument = Omit<GamingClubPostType, "created_at" | "updated_at" | "deleted_at"> & {
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
};

const GamingClubPostSchema = new Schema<GamingClubDocument>(
    {
        author: { type: String, required: true },
        club_id: { type: String, required: true },
        content: { type: String, required: true },
        is_spoiler: { type: Boolean, default: false },
        created_at: { type: Date, required: true },
        updated_at: { type: Date, default: null },
        deleted_at: { type: Date, default: null },
    },
    { versionKey: false },
);

export const GamingClubPostModel = model<GamingClubDocument>(
    "GamingClubPost",
    GamingClubPostSchema,
);
