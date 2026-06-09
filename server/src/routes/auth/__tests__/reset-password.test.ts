import { vi, describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../../app";
import { clearDatabase } from "../../../test-helpers/db";
import { sendPasswordResetEmail } from "../../../services/email";
import { getResetToken } from "../../../test-helpers/auth";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return {
        default: {
            create: () => new session.default.MemoryStore(),
        },
    };
});

vi.mock("../../../services/email", () => ({
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
    vi.mocked(sendPasswordResetEmail).mockClear();
    await request(app).post("/api/v1/auth/register").send(testUser);
});

describe("POST /api/v1/auth/reset-password", () => {
    it("returns 200 on valid token and new password", async () => {
        const token = await getResetToken(testUser.email);

        const res = await request(app)
            .post("/api/v1/auth/reset-password")
            .send({ hash: token, new_password: "newpassword123" });

        expect(res.status).toBe(200);
    });

    it("returns 400 on invalid token", async () => {
        const res = await request(app)
            .post("/api/v1/auth/reset-password")
            .send({ hash: "invalidtoken", new_password: "newpassword123" });

        expect(res.status).toBe(400);
    });

    it("returns 400 on missing fields", async () => {
        const res = await request(app).post("/api/v1/auth/reset-password").send();

        expect(res.status).toBe(400);
    });

    it("returns 400 on weak password", async () => {
        const token = await getResetToken(testUser.email);

        const res = await request(app)
            .post("/api/v1/auth/reset-password")
            .send({ hash: token, new_password: "short" });

        expect(res.status).toBe(400);
    });

    it("returns 400 when token is used a second time", async () => {
        const token = await getResetToken(testUser.email);

        await request(app)
            .post("/api/v1/auth/reset-password")
            .send({ hash: token, new_password: "newpassword123" });

        const res = await request(app)
            .post("/api/v1/auth/reset-password")
            .send({ hash: token, new_password: "anotherpassword123" });

        expect(res.status).toBe(400);
    });
});
