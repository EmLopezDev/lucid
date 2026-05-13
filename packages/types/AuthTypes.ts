import * as z from "zod";

export const Auth = z.object({
    _id: z.uuid(),
    user_id: z.string(),
    hash: z.string(),
    reset_token_hash: z.string().nullable().default(null),
    reset_token_expires: z.date().nullable().default(null),
    created_at: z.date(),
    updated_at: z.date(),
    deleted_at: z.date(),
});

export type AuthType = z.infer<typeof Auth>;
