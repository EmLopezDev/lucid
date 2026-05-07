import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return { default: { create: () => new session.default.MemoryStore() } };
});

import request from "supertest";
import app from "../../app";
import { clearDatabase } from "../helpers/db";

const userId = "test-user-id";

const testGame = {
    title: "The Last of Us",
    genre: "action adventure",
    platform: "playstation",
    status: "playing",
};

beforeEach(async () => {
    await clearDatabase();
});

describe("DELETE /api/v1/user/:userId/library/:gameId", () => {
    it("returns 200 and the deleted game id on success", async () => {
        const created = await request(app)
            .post(`/api/v1/user/${userId}/library`)
            .send(testGame);

        const res = await request(app)
            .delete(`/api/v1/user/${userId}/library/${created.body._id}`);

        expect(res.status).toBe(200);
        expect(res.body._id).toBe(created.body._id);
    });

    it("removes the game from the library after deletion", async () => {
        const created = await request(app)
            .post(`/api/v1/user/${userId}/library`)
            .send(testGame);

        await request(app).delete(`/api/v1/user/${userId}/library/${created.body._id}`);

        const library = await request(app).get(`/api/v1/user/${userId}/library`);
        expect(library.body).toHaveLength(0);
    });

    it("does not delete games belonging to another user", async () => {
        const otherUserId = "other-user-id";

        const created = await request(app)
            .post(`/api/v1/user/${otherUserId}/library`)
            .send(testGame);

        const res = await request(app)
            .delete(`/api/v1/user/${userId}/library/${created.body._id}`);

        expect(res.status).toBe(404);

        const library = await request(app).get(`/api/v1/user/${otherUserId}/library`);
        expect(library.body).toHaveLength(1);
    });

    it("returns 404 when the game does not exist", async () => {
        const res = await request(app)
            .delete(`/api/v1/user/${userId}/library/000000000000000000000001`);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Game not found");
    });
});
