import mongoose from "mongoose";
import {
    type UserRegisterType,
    type UserSigninType,
} from "../../../../packages/types/UserTypes";
import { UserModel } from "./user.mongo";
import {
    registerAuthCredential,
    signInAuthCredentials,
} from "../auth/auth.model";

export const findUserByEmail = async (email: string) => {
    return await UserModel.findOne({ email: email });
};

export const registerUser = async (user: UserRegisterType) => {
    const userExists = await findUserByEmail(user.email);

    if (userExists) {
        throw new Error("User already exists");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { password, ...userWithoutPassword } = user;
        const registeredUser = await UserModel.create(userWithoutPassword);
        await registerAuthCredential({ id: registeredUser._id, password });
        await session.commitTransaction();

        return registeredUser;
    } catch (error) {
        if (error instanceof Error) {
            await session.abortTransaction();
            throw new Error(error.name);
        }
    } finally {
        session.endSession();
    }
};

export const signinUser = async (user: UserSigninType) => {
    const userExists = await findUserByEmail(user.email);

    if (!userExists) {
        throw new Error("User doesn't exists");
    }

    await signInAuthCredentials({
        id: userExists._id,
        password: user.password,
    });

    return userExists;
};
