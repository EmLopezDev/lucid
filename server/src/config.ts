import dotenv from "dotenv";

dotenv.config({ path: ".env.local", override: false });
dotenv.config();

if (!process.env.SESSION_SECRET) {
    throw new Error(
        "SESSION_SECRET environment variable is required. Run `vercel env pull` to set it locally.",
    );
}

if (!process.env.MONGO_URL) {
    throw new Error(
        "MONGO_URL environment variable is required. Run `vercel env pull` to set it locally.",
    );
}

if (!process.env.ALLOWED_ORIGINS && process.env.NODE_ENV === "production") {
    throw new Error("ALLOWED_ORIGINS environment variable is required in production");
}

const config = {
    PORT: process.env.PORT || 8000,
    MONGO_URL: process.env.MONGO_URL,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(",") ?? ["http://localhost:5173"],
    CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:5173",
    SESSION_SECRET: process.env.SESSION_SECRET,
    NODE_ENV: process.env.NODE_ENV || "development",
    SENTRY_DSN: process.env.SENTRY_DSN,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    RAWG_API_KEY: process.env.RAWG_API_KEY,
};

export default config;
