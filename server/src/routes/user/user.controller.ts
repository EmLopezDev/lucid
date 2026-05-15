import { type Request, type Response, type NextFunction } from "express";
import { UserUpdateProfile, UserUpdatePassword } from "../../../../packages/types/UserTypes";
import { updateUser, updatePassword, destroyUser } from "../../models/user/user.model";
import { flattenError } from "zod";

export const patchUser = async (
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userId } = req.params;
        const body = UserUpdateProfile.safeParse(req.body);
        if (!body.success) {
            return res
                .status(400)
                .json({ message: "Invalid fields", errors: flattenError(body.error) });
        }
        const user = await updateUser(userId, body.data);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userId } = req.params;
        await destroyUser(userId);
        req.session.destroy(() => {
            res.status(204).end();
        });
    } catch (error) {
        next(error);
    }
};

export const patchPassword = async (
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { userId } = req.params;
        const body = UserUpdatePassword.safeParse(req.body);
        if (!body.success) {
            return res
                .status(400)
                .json({ message: "Invalid fields", errors: flattenError(body.error) });
        }

        await updatePassword(userId, body.data);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
