import { Schema, model } from "mongoose";
import { type UserType } from "../../../../packages/types/UserTypes";

const UserSchema = new Schema<UserType>({
    id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    created_at: { type: Date, required: true, default: new Date() },
    updated_at: { type: Date, default: null },
    deleted_at: { type: Date, default: null },
});

export const UserModel = model<UserType>("User", UserSchema);
