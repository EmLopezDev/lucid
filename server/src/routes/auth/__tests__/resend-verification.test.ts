import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return { default: { create: () => new session.default.MemoryStore() } };
});

import request from "supertest";
import app from "../../../app";
import { clearDatabase } from "../../../test-helpers/db";
import { getVerificationToken, verifyTestUser } from "../../../test-helpers/auth";
import { sendEmailVerificationEmail } from "../../../services/email";

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

describe("POST /api/v1/auth/resend-verification", () => {
    it("returns 200 for an unverified user", async () => {
        const res = await request(app)
            .post("/api/v1/auth/resend-verification")
            .send({ email: testUser.email });

        expect(res.status).toBe(200);
    });

    it("sends a new verification email", async () => {
        const callsBefore = vi.mocked(sendEmailVerificationEmail).mock.calls.length;

        await request(app).post("/api/v1/auth/resend-verification").send({ email: testUser.email });

        expect(vi.mocked(sendEmailVerificationEmail).mock.calls.length).toBe(callsBefore + 1);
    });

    it("new token from resend works for verification", async () => {
        await request(app).post("/api/v1/auth/resend-verification").send({ email: testUser.email });

        const newToken = getVerificationToken();
        const res = await request(app).get(`/api/v1/auth/verify-email?token=${newToken}`);

        expect(res.status).toBe(200);
    });

    it("returns 200 silently for an unknown email", async () => {
        const res = await request(app)
            .post("/api/v1/auth/resend-verification")
            .send({ email: "nobody@example.com" });

        expect(res.status).toBe(200);
    });

    it("does not send an email for an unknown address", async () => {
        const callsBefore = vi.mocked(sendEmailVerificationEmail).mock.calls.length;

        await request(app)
            .post("/api/v1/auth/resend-verification")
            .send({ email: "nobody@example.com" });

        expect(vi.mocked(sendEmailVerificationEmail).mock.calls.length).toBe(callsBefore);
    });

    it("returns 200 silently for an already-verified user", async () => {
        await verifyTestUser(testUser.email);

        const res = await request(app)
            .post("/api/v1/auth/resend-verification")
            .send({ email: testUser.email });

        expect(res.status).toBe(200);
    });

    it("does not send an email for an already-verified user", async () => {
        await verifyTestUser(testUser.email);
        const callsBefore = vi.mocked(sendEmailVerificationEmail).mock.calls.length;

        await request(app).post("/api/v1/auth/resend-verification").send({ email: testUser.email });

        expect(vi.mocked(sendEmailVerificationEmail).mock.calls.length).toBe(callsBefore);
    });

    it("returns 400 for an invalid email format", async () => {
        const res = await request(app)
            .post("/api/v1/auth/resend-verification")
            .send({ email: "not-an-email" });

        expect(res.status).toBe(400);
    });

    it("returns 400 when email is missing", async () => {
        const res = await request(app).post("/api/v1/auth/resend-verification").send({});

        expect(res.status).toBe(400);
    });
});
