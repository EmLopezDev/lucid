import bcrypt from "bcryptjs";
import { AuthModel } from "./auth.mongo";

type AuthCredentialsType = {
    id: string;
    password: string;
};

export const registerAuthCredential = async (credentials: AuthCredentialsType) => {
    const { id, password } = credentials;
    const hash = await bcrypt.hash(password, 12);
    return await AuthModel.create({ user_id: id, hash });
};

export const signInAuthCredentials = async (credentials: AuthCredentialsType) => {
    const { id, password } = credentials;
    const userCredentials = await AuthModel.findOne({ user_id: id });
    if (!userCredentials) {
        throw new Error("Unable to sign in, please try again");
    }

    const validatePassword = await bcrypt.compare(password, userCredentials.hash);
    if (!validatePassword) {
        throw new Error("One or more credentials is incorrect");
    }
};
