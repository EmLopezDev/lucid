import "express-session";

declare module "express-session" {
    interface SessionData {
        userId: string;
    }
}

declare global {
    namespace Express {
        interface Locals {
            userId: string;
        }
    }
}
