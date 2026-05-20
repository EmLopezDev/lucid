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
    platform: "PlayStation 5",
    status: "playing",
};

let agent: Awaited<ReturnType<typeof createAuthenticatedAgent>>["agent"];
let userId: string;

beforeEach(async () => {
    await clearDatabase();
    ({ agent, userId } = await createAuthenticatedAgent());
});

describe("PATCH /api/v1/user/:userId/library/:gameId", () => {
    it("returns 200 and the updated game on valid data", async () => {
        const created = await agent.post(`/api/v1/user/${userId}/library`).send(testGame);

        const res = await agent
            .patch(`/api/v1/user/${userId}/library/${created.body._id}`)
            .send({ title: "The Last of Us Part II", status: "completed" });

        expect(res.status).toBe(200);
        expect(res.body.title).toBe("The Last of Us Part II");
        expect(res.body.status).toBe("completed");
    });

    it("preserves untouched fields when only partial data is sent", async () => {
        const created = await agent.post(`/api/v1/user/${userId}/library`).send(testGame);

        const res = await agent
            .patch(`/api/v1/user/${userId}/library/${created.body._id}`)
            .send({ title: "The Last of Us Part II" });

        expect(res.status).toBe(200);
        expect(res.body.title).toBe("The Last of Us Part II");
        expect(res.body.genre).toBe(testGame.genre);
        expect(res.body.platform).toBe(testGame.platform);
        expect(res.body.status).toBe(testGame.status);
    });

    it("returns 404 when the game does not exist", async () => {
        const res = await agent
            .patch(`/api/v1/user/${userId}/library/000000000000000000000001`)
            .send({ title: "Ghost Game" });

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Game not found");
    });

    it("returns 400 when fields are invalid", async () => {
        const created = await agent.post(`/api/v1/user/${userId}/library`).send(testGame);

        const res = await agent
            .patch(`/api/v1/user/${userId}/library/${created.body._id}`)
            .send({ status: "invalid-status" });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid fields");
    });

    it("returns 403 when updating another user's game", async () => {
        const { agent: otherAgent, userId: otherUserId } = await createAuthenticatedAgent({
            email: "other@example.com",
        });

        const created = await otherAgent.post(`/api/v1/user/${otherUserId}/library`).send(testGame);

        const res = await agent
            .patch(`/api/v1/user/${otherUserId}/library/${created.body._id}`)
            .send({ title: "Hacked Title" });

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Forbidden");
    });
});
