import * as z from "zod";

export const BaseUser = z.object({
    id: z.uuid(),
    first_name: z.string().regex(/^[a-zA-Z\s]+$/, {
        error: "Missing or Invalid field",
    }),
    last_name: z.string().regex(/^[a-zA-Z\s]+$/, {
        error: "Missing or Invalid field",
    }),
    email: z.email(),
    password: z.string().min(8, { error: "Must be a minimum of 8 characters" }),
    created_at: z.date(),
    updated_at: z.date(),
    deleted_at: z.date(),
});

export const User = BaseUser.pick({
    id: true,
    first_name: true,
    last_name: true,
    email: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
});

export type UserType = z.infer<typeof User>;

export const UserRegister = BaseUser.pick({
    first_name: true,
    last_name: true,
    email: true,
    password: true,
});

export type UserRegisterType = z.infer<typeof UserRegister>;

export const UserSignin = BaseUser.pick({
    email: true,
    password: true,
});

export type UserSigninType = z.infer<typeof UserSignin>;

export const UserSelect = BaseUser.pick({
    id: true,
});
