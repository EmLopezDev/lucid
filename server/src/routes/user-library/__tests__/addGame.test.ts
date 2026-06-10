import { vi, describe, it, expect, beforeEach } from "vitest";
import { clearDatabase } from "../../../test-helpers/db";
import { createAuthenticatedAgent } from "../../../test-helpers/auth";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return { default: { create: () => new session.default.MemoryStore() } };
});

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

describe("POST /api/v1/user/:userId/library", () => {
    it("returns 201 and the created game on valid data", async () => {
        const res = await agent.post(`/api/v1/user/${userId}/library`).send(testGame);

        expect(res.status).toBe(201);
        expect(res.body.title).toBe(testGame.title);
        expect(res.body.genre).toBe(testGame.genre);
        expect(res.body.platform).toBe(testGame.platform);
        expect(res.body.status).toBe(testGame.status);
        expect(res.body.user_id).toBe(userId);
        expect(res.body._id).toBeDefined();
    });

    it("returns 201 with nulls when only title is provided", async () => {
        const res = await agent
            .post(`/api/v1/user/${userId}/library`)
            .send({ title: "Incomplete Game" });

        expect(res.status).toBe(201);
        expect(res.body.title).toBe("Incomplete Game");
        expect(res.body.genre).toBeNull();
        expect(res.body.platform).toBeNull();
        expect(res.body.status).toBeNull();
    });

    it("returns 400 when status is invalid", async () => {
        const res = await agent
            .post(`/api/v1/user/${userId}/library`)
            .send({ ...testGame, status: "unknown" });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid fields");
    });

    it("returns 400 when genre is invalid", async () => {
        const res = await agent
            .post(`/api/v1/user/${userId}/library`)
            .send({ ...testGame, genre: "unknown" });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid fields");
    });
});
