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
        "_id first_name last_name email email_verified bio created_at",
    );
};

export const findUserById = async (id: string) => {
    return await UserModel.findById(id).select(
        "_id first_name last_name email email_verified bio created_at",
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
    ).select("_id first_name last_name email bio created_at updated_at");

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

export const getUserProfile = async (userId: string) => {
    const user = await UserModel.findById(userId).select("_id first_name last_name bio created_at");
    if (!user) throw new HttpError("User not found", 404);

    const gameProjection = {
        _id: 1,
        title: 1,
        cover_url: 1,
        status: 1,
        genre: 1,
        rating: 1,
        hours_played: 1,
    };

    const [facet] = await UserLibraryModel.aggregate([
        { $match: { user_id: userId, deleted_at: null } },
        {
            $facet: {
                stats: [
                    {
                        $group: {
                            _id: null,
                            totalGames: { $sum: 1 },
                            totalHoursPlayed: { $sum: { $ifNull: ["$hours_played", 0] } },
                            gamesWithStatus: {
                                $sum: { $cond: [{ $ne: ["$status", null] }, 1, 0] },
                            },
                            completedGames: {
                                $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
                            },
                            averageRating: { $avg: "$rating" },
                            pricedGames: { $sum: { $cond: [{ $ne: ["$price", null] }, 1, 0] } },
                            totalSpent: {
                                $sum: {
                                    $cond: [{ $ne: ["$price", null] }, { $toDouble: "$price" }, 0],
                                },
                            },
                        },
                    },
                ],
                genreCounts: [
                    { $match: { genre: { $ne: null } } },
                    { $group: { _id: "$genre", count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                    { $limit: 1 },
                ],
                currentlyPlaying: [
                    { $match: { status: "playing" } },
                    { $sort: { created_at: -1 } },
                    {
                        $project: gameProjection,
                    },
                ],
                completed: [
                    { $match: { status: "completed" } },
                    { $sort: { created_at: -1 } },
                    {
                        $project: gameProjection,
                    },
                ],
                recentlyAdded: [
                    { $sort: { created_at: -1 } },
                    { $limit: 6 },
                    {
                        $project: gameProjection,
                    },
                ],
            },
        },
    ]);

    const statsRaw = facet.stats[0];

    const totalGames = statsRaw?.totalGames ?? 0;
    const totalHoursPlayed = statsRaw?.totalHoursPlayed ?? 0;
    const completionRate =
        statsRaw?.gamesWithStatus > 0
            ? Math.round((statsRaw.completedGames / statsRaw.gamesWithStatus) * 100)
            : 0;
    const averageRating =
        statsRaw?.averageRating != null ? +statsRaw.averageRating.toFixed(2) : null;
    const mostPlayedGenre = facet.genreCounts[0]?._id ?? null;
    const totalSpent = statsRaw?.pricedGames > 0 ? +statsRaw.totalSpent.toFixed(2) : null;

    return {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        bio: user.bio ?? null,
        created_at: user.created_at,
        stats: {
            totalGames,
            totalHoursPlayed,
            completionRate,
            averageRating,
            mostPlayedGenre,
            totalSpent,
        },
        currentlyPlaying: facet.currentlyPlaying,
        completed: facet.completed,
        recentlyAdded: facet.recentlyAdded,
    };
};
