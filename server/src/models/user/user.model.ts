import mongoose from "mongoose";
import {
    type UserRegisterType,
    type UserSigninType,
    type UserUpdatePasswordType,
    type UserUpdateProfileType,
} from "../../../../packages/types/UserTypes";
import { UserModel } from "./user.mongo";
import {
    createEmailVerificationToken,
    createPasswordResetToken,
    registerAuthCredential,
    resetPasswordWithToken,
    signInAuthCredentials,
    verifyEmailToken,
} from "../auth/auth.model";
import { HttpError } from "../../middleware/HttpError";
import { AuthModel } from "../auth/auth.mongo";
import { UserLibraryModel } from "../user-library/user-library.mongo";
import { sendEmailVerificationEmail, sendPasswordResetEmail } from "../../services/email";
import bcrypt from "bcryptjs";
import config from "../../config";

export const findUserByEmail = async (email: string) => {
    return await UserModel.findOne({ email: email }).select(
        "_id first_name last_name email email_verified created_at",
    );
};

export const findUserById = async (id: string) => {
    return await UserModel.findById(id).select(
        "_id first_name last_name email email_verified created_at",
    );
};

export const registerUser = async (user: UserRegisterType) => {
    const userExists = await findUserByEmail(user.email);

    if (userExists) {
        throw new HttpError("User already exists", 409);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    let registeredUser;
    try {
        const { password, ...userWithoutPassword } = user;
        registeredUser = await UserModel.create(userWithoutPassword);
        await registerAuthCredential({ id: registeredUser._id, password });
        await session.commitTransaction();
    } catch {
        await session.abortTransaction();
        throw new Error("Unable to register");
    } finally {
        session.endSession();
    }

    const token = await createEmailVerificationToken(registeredUser._id);
    const verifyURL = `${config.CLIENT_URL}/verify-email?token=${token}`;
    await sendEmailVerificationEmail(user.email, verifyURL);

    return registeredUser;
};

export const signinUser = async (user: UserSigninType) => {
    const userExists = await findUserByEmail(user.email);

    if (!userExists) {
        throw new HttpError("One or more credentials is incorrect", 401);
    }

    if (!userExists.email_verified) {
        throw new HttpError("Please verify your email before signing in", 403);
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

const PROTECTED_EMAILS = ["demo@lucid.com", "dev@lucid.com"];

export const destroyUser = async (id: string) => {
    const user = await UserModel.findById(id).select("email");
    if (!user) throw new HttpError("User not found", 404);
    if (PROTECTED_EMAILS.includes(user.email)) {
        throw new HttpError("This account cannot be deleted", 403);
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await UserModel.findByIdAndDelete(id, { session });
        await AuthModel.findOneAndDelete({ user_id: id }, { session });
        await UserLibraryModel.deleteMany({ user_id: id }, { session });
        await session.commitTransaction();
    } catch {
        await session.abortTransaction();
        throw new HttpError("Unable to delete user", 500);
    } finally {
        session.endSession();
    }
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

export const verifyUserEmail = async (token: string) => {
    const userId = await verifyEmailToken(token);
    await UserModel.findByIdAndUpdate(userId, { email_verified: true });
};

export const resendEmailVerification = async (email: string) => {
    const user = await findUserByEmail(email);
    if (!user || user.email_verified) return;
    const token = await createEmailVerificationToken(user._id);
    const verifyURL = `${config.CLIENT_URL}/verify-email?token=${token}`;
    await sendEmailVerificationEmail(email, verifyURL);
};
