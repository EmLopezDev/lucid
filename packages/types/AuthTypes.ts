import * as z from "zod";

export const Auth = z.object({
    _id: z.uuid(),
    user_id: z.string(),
    hash: z.string(),
    created_at: z.date(),
    updated_at: z.date(),
    deleted_at: z.date(),
});

export type AuthType = z.infer<typeof Auth>;
