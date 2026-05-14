import { vi, describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../app";
import { clearDatabase } from "../helpers/db";
import { verifyTestUser } from "../helpers/auth";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return {
        default: {
            create: () => new session.default.MemoryStore(),
        },
    };
});

const testUser = {
    first_name: "Test",
    last_name: "User",
    email: "test@example.com",
    password: "password123",
};

beforeEach(async () => {
    await clearDatabase();
});

describe("POST /api/v1/auth/signout", () => {
    it("returns 200 and clears the session", async () => {
        const agent = request.agent(app);

        await agent.post("/api/v1/auth/register").send(testUser);
        await verifyTestUser(testUser.email);
        await agent.post("/api/v1/auth/signin").send({
            email: testUser.email,
            password: testUser.password,
        });

        const signout = await agent.post("/api/v1/auth/signout");
        expect(signout.status).toBe(200);
        expect(signout.body.message).toBe("Signed out successfully");

        const session = await agent.get("/api/v1/auth/session");
        expect(session.status).toBe(401);
    });
});
