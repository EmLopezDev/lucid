import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return { default: { create: () => new session.default.MemoryStore() } };
});

import { clearDatabase } from "../helpers/db";
import { createAuthenticatedAgent } from "../helpers/auth";

const testGame = {
    title: "The Last of Us",
    genre: "action",
    platform: "playstation",
    status: "playing",
};

let agent: Awaited<ReturnType<typeof createAuthenticatedAgent>>["agent"];
let userId: string;

beforeEach(async () => {
    await clearDatabase();
    ({ agent, userId } = await createAuthenticatedAgent());
});

describe("DELETE /api/v1/user/:userId/library/:gameId", () => {
    it("returns 200 and the deleted game id on success", async () => {
        const created = await agent.post(`/api/v1/user/${userId}/library`).send(testGame);

        const res = await agent.delete(`/api/v1/user/${userId}/library/${created.body._id}`);

        expect(res.status).toBe(200);
        expect(res.body._id).toBe(created.body._id);
    });

    it("removes the game from the library after deletion", async () => {
        const created = await agent.post(`/api/v1/user/${userId}/library`).send(testGame);

        await agent.delete(`/api/v1/user/${userId}/library/${created.body._id}`);

        const library = await agent.get(`/api/v1/user/${userId}/library`);
        expect(library.body).toHaveLength(0);
    });

    it("returns 404 when the game does not exist", async () => {
        const res = await agent.delete(`/api/v1/user/${userId}/library/000000000000000000000001`);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Game not found");
    });

    it("returns 403 when deleting another user's game", async () => {
        const { agent: otherAgent, userId: otherUserId } = await createAuthenticatedAgent({
            email: "other@example.com",
        });

        const created = await otherAgent.post(`/api/v1/user/${otherUserId}/library`).send(testGame);

        const res = await agent.delete(`/api/v1/user/${otherUserId}/library/${created.body._id}`);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Forbidden");
    });
});
