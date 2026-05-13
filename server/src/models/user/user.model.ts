import mongoose from "mongoose";
import {
    type UserRegisterType,
    type UserSigninType,
    type UserUpdatePasswordType,
    type UserUpdateProfileType,
} from "../../../../packages/types/UserTypes";
import { UserModel } from "./user.mongo";
import {
    createPasswordResetToken,
    registerAuthCredential,
    resetPasswordWithToken,
    signInAuthCredentials,
} from "../auth/auth.model";
import { HttpError } from "../../middleware/HttpError";
import bcrypt from "bcryptjs";
import { AuthModel } from "../auth/auth.mongo";
import config from "../../config";
import { sendPasswordResetEmail } from "../../services/email";

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
        throw new HttpError("User already exists", 409);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { password, ...userWithoutPassword } = user;
        const registeredUser = await UserModel.create(userWithoutPassword);
        await registerAuthCredential({ id: registeredUser._id, password });
        await session.commitTransaction();

        return registeredUser;
    } catch {
        await session.abortTransaction();
        throw new Error("Unable to register");
    } finally {
        session.endSession();
    }
};

export const signinUser = async (user: UserSigninType) => {
    const userExists = await findUserByEmail(user.email);

    if (!userExists) {
        throw new HttpError("One or more credentials is incorrect", 401);
    }

    await signInAuthCredentials({
        id: userExists._id,
        password: user.password,
    });

    return userExists;
};

export const updateUser = async (id: string, updates: UserUpdateProfileType) => {
    const user = await UserModel.findByIdAndUpdate(
        id,
        { ...updates, updated_at: new Date() },
        { new: true },
    ).select("_id first_name last_name email created_at updated_at");

    if (!user) {
        throw new HttpError("User not found", 404);
    }
    return user;
};

export const updatePassword = async (id: string, credentials: UserUpdatePasswordType) => {
    await signInAuthCredentials({ id, password: credentials.current_password });

    const hash = await bcrypt.hash(credentials.new_password, 12);
    await AuthModel.findOneAndUpdate({ user_id: id }, { hash });
};

export const requestPasswordReset = async (email: string) => {
    const userExists = await findUserByEmail(email);
    if (!userExists) return;
    const token = await createPasswordResetToken(userExists._id);
    const resetURL = `${config.CLIENT_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(userExists.email, resetURL);
};

export const resetUserPassword = async (token: string, newPassword: string) => {
    await resetPasswordWithToken(token, newPassword);
};
