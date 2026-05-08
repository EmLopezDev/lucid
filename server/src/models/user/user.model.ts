import mongoose from "mongoose";
import { type UserRegisterType, type UserSigninType } from "../../../../packages/types/UserTypes";
import { UserModel } from "./user.mongo";
import { registerAuthCredential, signInAuthCredentials } from "../auth/auth.model";

export const findUserByEmail = async (email: string) => {
    return await UserModel.findOne({ email: email }).select(
        "_id first_name last_name email created_at",
    );
};

export const findUserById = async (id: string) => {
    return await UserModel.findById(id).select("_id first_name last_name email created_at");
};

export const registerUser = async (user: UserRegisterType) => {
    const userExists = await findUserByEmail(user.email);

    if (userExists) {
        throw new Error("User already exist");
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
            throw new Error("Unable to register");
        }
    } finally {
        session.endSession();
    }
};

export const signinUser = async (user: UserSigninType) => {
    const userExists = await findUserByEmail(user.email);

    if (!userExists) {
        throw new Error("One or more credentials is incorrect");
    }

    await signInAuthCredentials({
        id: userExists._id,
        password: user.password,
    });

    return userExists;
};
