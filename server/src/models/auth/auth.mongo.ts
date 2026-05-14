import { Schema, model } from "mongoose";
import { type AuthType } from "../../../../packages/types/AuthTypes";

const AuthSchema = new Schema<AuthType>(
    {
        user_id: { type: String, required: true },
        hash: { type: String, required: true },
        reset_token_hash: { type: String, default: null },
        reset_token_expires: { type: Date, default: null },
        email_verification_token_hash: { type: String, default: null },
        email_verification_token_expires: { type: Date, default: null },
        created_at: { type: Date, required: true, default: () => new Date() },
        updated_at: { type: Date, default: null },
        deleted_at: { type: Date, default: null },
    },
    { versionKey: false },
);

export const AuthModel = model<AuthType>("Auth", AuthSchema);
