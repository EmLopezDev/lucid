import nodemailer from "nodemailer";
import config from "../config";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
    },
});

export const sendPasswordResetEmail = async (to: string, resetUrl: string) => {
    await transporter.sendMail({
        from: config.EMAIL_USER,
        to,
        subject: "Password reset for Lucid",
        html: `<p>Reset your password here: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });
};
