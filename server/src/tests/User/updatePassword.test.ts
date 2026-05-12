import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return { default: { create: () => new session.default.MemoryStore() } };
});

import { clearDatabase } from "../helpers/db";
import { createAuthenticatedAgent } from "../helpers/auth";

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
});
