import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return { default: { create: () => new session.default.MemoryStore() } };
});

import request from "supertest";
import app from "../../../app";
import { clearDatabase } from "../../../test-helpers/db";

const userId = "test-user-id";

const testGame = {
    title: "The Last of Us",
    genre: "action",
    platform: "PlayStation 5",
    status: "playing",
};

beforeEach(async () => {
    await clearDatabase();
});

describe("UserLibrary auth guard", () => {
    it("returns 401 on GET when not authenticated", async () => {
        const res = await request(app).get(`/api/v1/user/${userId}/library`);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Not authenticated");
    });

    it("returns 401 on POST when not authenticated", async () => {
        const res = await request(app).post(`/api/v1/user/${userId}/library`).send(testGame);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Not authenticated");
    });

    it("returns 401 on PATCH when not authenticated", async () => {
        const res = await request(app)
            .patch(`/api/v1/user/${userId}/library/000000000000000000000001`)
            .send({ title: "Updated" });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Not authenticated");
    });

    it("returns 401 on DELETE when not authenticated", async () => {
        const res = await request(app).delete(
            `/api/v1/user/${userId}/library/000000000000000000000001`,
        );

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Not authenticated");
    });
});
