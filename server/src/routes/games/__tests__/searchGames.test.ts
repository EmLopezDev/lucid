import { vi, describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../../app";
import { clearDatabase } from "../../../test-helpers/db";
import { createAuthenticatedAgent } from "../../../test-helpers/auth";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return { default: { create: () => new session.default.MemoryStore() } };
});

vi.mock("../../../services/rawg", () => ({
    searchGame: vi.fn(),
}));

import { searchGame } from "../../../services/rawg";

const mockResults: Awaited<ReturnType<typeof searchGame>> = [
    {
        id: 3498,
        title: "Grand Theft Auto V",
        coverUrl: "https://example.com/gta5.jpg",
        platforms: ["PlayStation 5", "Xbox One", "PC"],
        genres: ["action"],
    },
];

let agent: Awaited<ReturnType<typeof createAuthenticatedAgent>>["agent"];

beforeEach(async () => {
    await clearDatabase();
    ({ agent } = await createAuthenticatedAgent());
    vi.mocked(searchGame).mockResolvedValue(mockResults);
});

describe("GET /api/v1/games/search", () => {
    it("returns 200 and results on a valid query", async () => {
        const res = await agent.get("/api/v1/games/search?q=mario");

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockResults);
    });

    it("returns 200 with an empty array when no results are found", async () => {
        vi.mocked(searchGame).mockResolvedValueOnce([]);

        const res = await agent.get("/api/v1/games/search?q=xyzzy");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it("returns 400 when q is missing", async () => {
        const res = await agent.get("/api/v1/games/search");

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid query");
    });

    it("returns 400 when q is too short", async () => {
        const res = await agent.get("/api/v1/games/search?q=a");

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid query");
    });

    it("returns 401 when not authenticated", async () => {
        const res = await request(app).get("/api/v1/games/search?q=mario");

        expect(res.status).toBe(401);
    });
});
