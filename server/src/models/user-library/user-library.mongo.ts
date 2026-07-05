import { Schema, model } from "mongoose";
import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";

type UserLibraryDocument = Omit<
    UserLibraryDataType,
    | "date_played"
    | "date_purchased"
    | "created_at"
    | "updated_at"
    | "deleted_at"
    | "played_with_club"
> & {
    played_with_club: {
        name: string;
        end_date: Date;
    } | null;
    date_played: Date | null;
    date_purchased: Date | null;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
};

const UserLibrarySchema = new Schema<UserLibraryDocument>(
    {
        user_id: { type: String, required: true },
        title: { type: String, required: true },
        genre: { type: String, default: null },
        platform: { type: String, default: null },
        status: { type: String, default: null },
        favorite: { type: Boolean, required: true, default: false },
        date_played: { type: Date, default: null },
        date_purchased: { type: Date, default: null },
        hours_played: { type: Number, default: null },
        rating: { type: Number, default: null },
        comment: { type: String, default: null },
        price: { type: String, default: null },
        cover_url: { type: String, default: null },
        played_with_club: {
            type: {
                name: { type: String, required: true },
                end_date: { type: Date, required: true },
            },
            default: null,
        },
        created_at: { type: Date, required: true },
        updated_at: { type: Date, default: null },
        deleted_at: { type: Date, default: null },
    },
    { versionKey: false },
);

UserLibrarySchema.index({ user_id: 1, deleted_at: 1 });

export const UserLibraryModel = model<UserLibraryDocument>("UserLibrary", UserLibrarySchema);
