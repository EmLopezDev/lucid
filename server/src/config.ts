import dotenv from "dotenv";

dotenv.config();

const config = {
    PORT: process.env.PORT || 8000,
    MONGO_URL: process.env.MONGO_URL || "",
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(",") ?? ["http://localhost:5173"],
};

export default config;
