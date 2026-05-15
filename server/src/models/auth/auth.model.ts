import bcrypt from "bcryptjs";
import { AuthModel } from "./auth.mongo";
import { HttpError } from "@middleware/HttpError";
import { randomBytes, createHash } from "node:crypto";

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

export const createPasswordResetToken = async (userId: string) => {
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await AuthModel.findOneAndUpdate(
        { user_id: String(userId) },
        { $set: { reset_token_hash: tokenHash, reset_token_expires: expires } },
    );

    return token;
};

export const createEmailVerificationToken = async (userId: string) => {
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await AuthModel.findOneAndUpdate(
        { user_id: String(userId) },
        { $set: { email_verification_token_hash: tokenHash, email_verification_token_expires: expires } },
    );

    return token;
};

export const verifyEmailToken = async (rawToken: string) => {
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");

    const authRecord = await AuthModel.findOne({
        email_verification_token_hash: tokenHash,
        email_verification_token_expires: { $gt: new Date() },
    });

    if (!authRecord) {
        throw new HttpError("Invalid or expired verification link", 400);
    }

    await AuthModel.findOneAndUpdate(
        { _id: authRecord._id },
        { email_verification_token_hash: null, email_verification_token_expires: null },
    );

    return authRecord.user_id;
};

export const resetPasswordWithToken = async (rawToken: string, newPassword: string) => {
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");

    const authRecord = await AuthModel.findOne({
        reset_token_hash: tokenHash,
        reset_token_expires: { $gt: new Date() },
    });

    if (!authRecord) {
        throw new HttpError("Invalid or expired reset token", 400);
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await AuthModel.findOneAndUpdate(
        { _id: authRecord._id },
        { hash: newHash, reset_token_hash: null, reset_token_expires: null },
    );
};
