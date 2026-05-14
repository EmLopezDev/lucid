import { vi, describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../app";
import { clearDatabase } from "../helpers/db";

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

describe("GET /api/v1/auth/session", () => {
    it("returns 401 when there is no active session", async () => {
        const res = await request(app).get("/api/v1/auth/session");

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Not authenticated");
    });

    it("returns 200 and the authenticated user when a valid session exists", async () => {
        const agent = request.agent(app);

        await agent.post("/api/v1/auth/register").send(testUser);
        await agent.post("/api/v1/auth/signin").send({
            email: testUser.email,
            password: testUser.password,
        });

        const res = await agent.get("/api/v1/auth/session");

        expect(res.status).toBe(200);
        expect(res.body.email).toBe(testUser.email);
        expect(res.body.first_name).toBe(testUser.first_name);
        expect(res.body.last_name).toBe(testUser.last_name);
    });

    it("returns 401 after signing out", async () => {
        const agent = request.agent(app);

        await agent.post("/api/v1/auth/register").send(testUser);
        await agent.post("/api/v1/auth/signin").send({
            email: testUser.email,
            password: testUser.password,
        });
        await agent.post("/api/v1/auth/signout");

        const res = await agent.get("/api/v1/auth/session");

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Not authenticated");
    });
});
