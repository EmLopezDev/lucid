import dotenv from "dotenv";

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
    SESSION_SECRET: process.env.SESSION_SECRET,
    NODE_ENV: process.env.NODE_ENV || "development",
};

export default config;
