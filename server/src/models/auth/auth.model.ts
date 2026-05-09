import bcrypt from "bcryptjs";
import { AuthModel } from "./auth.mongo";
import { HttpError } from "../../middleware/HttpError";

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
        throw new HttpError("One or more credentials is incorrect", 401);
    }

    const validatePassword = await bcrypt.compare(password, userCredentials.hash);
    if (!validatePassword) {
        throw new HttpError("One or more credentials is incorrect", 401);
    }
};
