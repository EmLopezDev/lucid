import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return { default: { create: () => new session.default.MemoryStore() } };
});

import request from "supertest";
import app from "../../app";
import { clearDatabase } from "../helpers/db";

const userId = "test-user-id";
const otherUserId = "other-user-id";

const testGame = {
    title: "The Last of Us",
    genre: "action adventure",
    platform: "playstation",
    status: "playing",
};

beforeEach(async () => {
    await clearDatabase();
});

describe("GET /api/v1/user/:userId/library", () => {
    it("returns 200 and an empty array when the user has no games", async () => {
        const res = await request(app).get(`/api/v1/user/${userId}/library`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it("returns 200 and the user's games", async () => {
        await request(app).post(`/api/v1/user/${userId}/library`).send(testGame);
        await request(app).post(`/api/v1/user/${userId}/library`).send({
            ...testGame,
            title: "God of War",
        });

        const res = await request(app).get(`/api/v1/user/${userId}/library`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].title).toBe("The Last of Us");
        expect(res.body[1].title).toBe("God of War");
    });

    it("does not return games belonging to another user", async () => {
        await request(app).post(`/api/v1/user/${otherUserId}/library`).send(testGame);

        const res = await request(app).get(`/api/v1/user/${userId}/library`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(0);
    });
});
