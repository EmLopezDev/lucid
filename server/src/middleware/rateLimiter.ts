import rateLimit from "express-rate-limit";

const isDev = process.env.NODE_ENV !== "production";

export const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: isDev ? 1000 : 10 });
export const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: isDev ? 10000 : 100 });
