import * as argon from "argon2";
import { AuthModel } from "./auth.mongo";

type AuthCredentialsType = {
    id: string;
    password: string;
};

export const registerAuthCredential = async (
    credentials: AuthCredentialsType,
) => {
    const { id, password } = credentials;

    const hash = await argon.hash(password);
    return await AuthModel.create({ user_id: id, hash });
};

export const signInAuthCredentials = async (
    credentials: AuthCredentialsType,
) => {
    const { id, password } = credentials;
    const userCredentials = await AuthModel.findOne({ user_id: id });
    if (!userCredentials) {
        throw new Error("Unable to sign in, please try again");
    }

    const validatePassword = await argon.verify(userCredentials.hash, password);

    if (!validatePassword) {
        throw new Error("One or more credentials is incorrect");
    }
};
