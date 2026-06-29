import "express-session";
import { type ClubDetailType } from "../../../packages/types/ClubTypes";

declare module "express-session" {
    interface SessionData {
        userId: string;
    }
}

declare global {
    namespace Express {
        interface Locals {
            userId: string;
            club: ClubDetailType;
        }
    }
}
