import { vi, describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../../app";
import { clearDatabase } from "../../../test-helpers/db";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return {
        default: {
            create: () => new session.default.MemoryStore(),
        },
    };
});

vi.mock("../../services/email", () => ({
    sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
    sendEmailVerificationEmail: vi.fn().mockResolvedValue(undefined),
}));

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

describe("POST /api/v1/auth/forgot-password", () => {
    it("return 200 on valid registered email", async () => {
        const res = await request(app)
            .post("/api/v1/auth/forgot-password")
            .send({ email: testUser.email });

        expect(res.status).toBe(200);
    });

    it("return 200 on unregistered email", async () => {
        const res = await request(app)
            .post("/api/v1/auth/forgot-password")
            .send({ email: "invalid@test.com" });

        expect(res.status).toBe(200);
    });

    it("return 400 on invalid email format", async () => {
        const res = await request(app)
            .post("/api/v1/auth/forgot-password")
            .send({ email: "not-an-email" });

        expect(res.status).toBe(400);
    });

    it("return 400 on missing email", async () => {
        const res = await request(app).post("/api/v1/auth/forgot-password").send();

        expect(res.status).toBe(400);
    });
});
