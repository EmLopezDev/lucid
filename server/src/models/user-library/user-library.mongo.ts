import { Schema, model } from "mongoose";
import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";

const UserLibrarySchema = new Schema<UserLibraryDataType>(
    {
        user_id: { type: String, required: true },
        title: { type: String, required: true },
        genre: { type: String, required: true },
        platform: { type: String, required: true },
        status: { type: String, required: true },
        favorite: { type: Boolean, required: true, default: false },
        date_played: { type: String, default: null },
        date_purchased: { type: String, default: null },
        hours_played: { type: Number, default: null },
        rating: { type: Number, default: null },
        comment: { type: String, default: null },
        price: { type: String, default: null },
        created_at: { type: String, required: true },
        updated_at: { type: String, default: null },
        deleted_at: { type: String, default: null },
    },
    { versionKey: false },
);

export const UserLibraryModel = model<UserLibraryDataType>("UserLibrary", UserLibrarySchema);
