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

describe("PATCH /api/v1/user/:userId", () => {
    it("returns 200 and updated fields on valid date", async () => {
        const res = await agent
            .patch(`/api/v1/user/${userId}`)
            .send({ first_name: "Jane", last_name: "Doe" });

        expect(res.status).toBe(200);
        expect(res.body.first_name).toBe("Jane");
        expect(res.body.last_name).toBe("Doe");
        expect(res.body.email).toBe("test@example.com");
    });

    it("returns 200 when only one field is send", async () => {
        const res = await agent.patch(`/api/v1/user/${userId}`).send({ email: "new@example.com" });

        expect(res.status).toBe(200);
        expect(res.body.first_name).toBe("Test");
        expect(res.body.last_name).toBe("User");
        expect(res.body.email).toBe("new@example.com");
    });

    it("returns 400 when a field is invalid", async () => {
        const res = await agent.patch(`/api/v1/user/${userId}`).send({ first_name: "123invalid" });

        expect(res.status).toBe(400);
    });

    it("returns 403 when updating another user's profile", async () => {
        const { userId: otherUserId } = await createAuthenticatedAgent({
            email: "other@example.com",
        });

        const res = await agent.patch(`/api/v1/user/${otherUserId}`).send({ first_name: "Hacked" });

        expect(res.status).toBe(403);
    });
});
