import rateLimit from "express-rate-limit";

const isDev = process.env.NODE_ENV !== "production";

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isDev ? 1000 : 10,
    message: { message: "Too many attempts. Please try again in 15 minutes." },
});
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isDev ? 10000 : 100,
    message: { message: "Too many requests. Please try again later." },
});
