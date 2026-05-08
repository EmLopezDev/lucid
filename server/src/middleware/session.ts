import session from "express-session";
import MongoStore from "connect-mongo";
import config from "../config";
import { mongoClientPromise } from "../services/mongo";

export const sessionMiddleware = session({
    name: "sid",
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ clientPromise: mongoClientPromise }),
    cookie: {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
});
