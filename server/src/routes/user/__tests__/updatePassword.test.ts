import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return { default: { create: () => new session.default.MemoryStore() } };
});

import request from "supertest";
import app from "../../../app";
import { clearDatabase } from "../../../test-helpers/db";
import { createAuthenticatedAgent } from "../../../test-helpers/auth";

let agent: Awaited<ReturnType<typeof createAuthenticatedAgent>>["agent"];
let userId: string;

beforeEach(async () => {
    await clearDatabase();
    ({ agent, userId } = await createAuthenticatedAgent());
});

describe("PATCH /api/v1/user/:userId/password", () => {
    it("returns 204 on valid current and new password", async () => {
        const res = await agent.patch(`/api/v1/user/${userId}/password`).send({
            current_password: "password123",
            new_password: "newpassword456",
        });

        expect(res.status).toBe(204);
    });

    it("returns 401 when current password is wrong", async () => {
        const res = await agent.patch(`/api/v1/user/${userId}/password`).send({
            current_password: "wrongpassword",
            new_password: "newpassword456",
        });

        expect(res.status).toBe(401);
    });

    it("returns 400 when new_password is too short", async () => {
        const res = await agent.patch(`/api/v1/user/${userId}/password`).send({
            current_password: "password123",
            new_password: "short",
        });

        expect(res.status).toBe(400);
        expect(res.body.errors.fieldErrors.new_password[0]).toBe(
            "Must be a minimum of 8 characters",
        );
    });

    it("returns 400 when current_password is missing", async () => {
        const res = await agent.patch(`/api/v1/user/${userId}/password`).send({
            new_password: "newpassword456",
        });

        expect(res.status).toBe(400);
    });

    it("returns 403 when updating another user's password", async () => {
        const { userId: otherUserId } = await createAuthenticatedAgent({
            email: "other@example.com",
        });

        const res = await agent.patch(`/api/v1/user/${otherUserId}/password`).send({
            current_password: "password123",
            new_password: "newpassword456",
        });

        expect(res.status).toBe(403);
    });

    it("user remains authenticated after password change", async () => {
        await agent.patch(`/api/v1/user/${userId}/password`).send({
            current_password: "password123",
            new_password: "newpassword456",
        });

        const res = await agent.get("/api/v1/auth/session");
        expect(res.status).toBe(200);
        expect(res.body._id).toBe(userId);
    });

    it("old password no longer works for sign-in after change", async () => {
        await agent.patch(`/api/v1/user/${userId}/password`).send({
            current_password: "password123",
            new_password: "newpassword456",
        });

        const res = await request(app)
            .post("/api/v1/auth/signin")
            .send({ email: "test@example.com", password: "password123" });

        expect(res.status).toBe(401);
    });
});
