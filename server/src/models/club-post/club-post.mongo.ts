import { Schema, model } from "mongoose";
import { type ClubPostType } from "../../../../packages/types/ClubPostTypes";

type ClubPostDocument = Omit<ClubPostType, "created_at" | "updated_at" | "deleted_at"> & {
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
};

const ClubPostSchema = new Schema<ClubPostDocument>(
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

ClubPostSchema.index({ club_id: 1, deleted_at: 1, created_at: -1 });

export const ClubPostModel = model<ClubPostDocument>("ClubPost", ClubPostSchema);
