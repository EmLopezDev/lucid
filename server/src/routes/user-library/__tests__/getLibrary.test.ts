import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return { default: { create: () => new session.default.MemoryStore() } };
});

import { clearDatabase } from "../../../test-helpers/db";
import { createAuthenticatedAgent } from "../../../test-helpers/auth";

const testGame = {
    title: "The Last of Us",
    genre: "action",
    platform: "PlayStation 5",
    status: "playing",
};

let agent: Awaited<ReturnType<typeof createAuthenticatedAgent>>["agent"];
let userId: string;

beforeEach(async () => {
    await clearDatabase();
    ({ agent, userId } = await createAuthenticatedAgent());
});

describe("GET /api/v1/user/:userId/library", () => {
    it("returns 200 and an empty array when the user has no games", async () => {
        const res = await agent.get(`/api/v1/user/${userId}/library`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it("returns 200 and the user's games", async () => {
        await agent.post(`/api/v1/user/${userId}/library`).send(testGame);
        await agent.post(`/api/v1/user/${userId}/library`).send({
            ...testGame,
            title: "God of War",
        });

        const res = await agent.get(`/api/v1/user/${userId}/library`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].title).toBe("The Last of Us");
        expect(res.body[1].title).toBe("God of War");
    });

    it("returns 403 when accessing another user's library", async () => {
        const { userId: otherUserId } = await createAuthenticatedAgent({
            email: "other@example.com",
        });

        const res = await agent.get(`/api/v1/user/${otherUserId}/library`);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Forbidden");
    });
});
