import { vi, describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../../app";
import { clearDatabase } from "../../../test-helpers/db";
import { getVerificationToken } from "../../../test-helpers/auth";

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
    await request(app).post("/api/v1/auth/register").send(testUser);
});

describe("GET /api/v1/auth/verify-email", () => {
    it("returns 200 on a valid token", async () => {
        const token = getVerificationToken();

        const res = await request(app).get(`/api/v1/auth/verify-email?token=${token}`);

        expect(res.status).toBe(200);
    });

    it("allows sign-in after verification", async () => {
        const token = getVerificationToken();
        await request(app).get(`/api/v1/auth/verify-email?token=${token}`);

        const res = await request(app).post("/api/v1/auth/signin").send({
            email: testUser.email,
            password: testUser.password,
        });

        expect(res.status).toBe(200);
    });

    it("returns 400 on an invalid token", async () => {
        const res = await request(app).get("/api/v1/auth/verify-email?token=invalidtoken");

        expect(res.status).toBe(400);
    });

    it("returns 400 on missing token", async () => {
        const res = await request(app).get("/api/v1/auth/verify-email");

        expect(res.status).toBe(400);
    });

    it("returns 400 when token is used a second time", async () => {
        const token = getVerificationToken();
        await request(app).get(`/api/v1/auth/verify-email?token=${token}`);

        const res = await request(app).get(`/api/v1/auth/verify-email?token=${token}`);

        expect(res.status).toBe(400);
    });
});
