import { vi, describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../../app";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return { default: { create: () => new session.default.MemoryStore() } };
});

import { clearDatabase } from "../../../test-helpers/db";
import { createAuthenticatedAgent } from "../../../test-helpers/auth";

let agent: Awaited<ReturnType<typeof createAuthenticatedAgent>>["agent"];
let userId: string;

beforeEach(async () => {
    await clearDatabase();
    ({ agent, userId } = await createAuthenticatedAgent());
});

const addGame = (a: typeof agent, id: string, overrides: Record<string, unknown> = {}) =>
    a.post(`/api/v1/user/${id}/library`).send({
        title: "Test Game",
        genre: "action",
        platform: "PC",
        status: "playing",
        ...overrides,
    });

describe("GET /api/v1/user/:userId/profile", () => {
    describe("authentication", () => {
        it("returns 401 when not signed in", async () => {
            const unauthenticated = request(app);
            const res = await unauthenticated.get(`/api/v1/user/${userId}/profile`);
            expect(res.status).toBe(401);
        });

        it("returns 403 when accessing another user's profile", async () => {
            const { userId: otherUserId } = await createAuthenticatedAgent({
                email: "other@example.com",
            });
            const res = await agent.get(`/api/v1/user/${otherUserId}/profile`);
            expect(res.status).toBe(403);
        });
    });

    describe("response shape", () => {
        it("returns 200 with the expected top-level fields", async () => {
            const res = await agent.get(`/api/v1/user/${userId}/profile`);

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                first_name: "Test",
                last_name: "User",
                bio: null,
                stats: expect.objectContaining({
                    totalGames: expect.any(Number),
                    totalHoursPlayed: expect.any(Number),
                    completionRate: expect.any(Number),
                    mostPlayedGenre: null,
                    totalSpent: null,
                }),
                currentlyPlaying: expect.any(Array),
                completed: expect.any(Array),
                recentlyAdded: expect.any(Array),
            });
        });

        it("returns created_at for the user", async () => {
            const res = await agent.get(`/api/v1/user/${userId}/profile`);
            expect(res.body.created_at).toBeDefined();
        });
    });

    describe("stats — empty library", () => {
        it("returns zero counts when the library is empty", async () => {
            const res = await agent.get(`/api/v1/user/${userId}/profile`);

            expect(res.body.stats.totalGames).toBe(0);
            expect(res.body.stats.totalHoursPlayed).toBe(0);
            expect(res.body.stats.completionRate).toBe(0);
            expect(res.body.stats.averageRating).toBeNull();
            expect(res.body.stats.mostPlayedGenre).toBeNull();
            expect(res.body.stats.totalSpent).toBeNull();
        });

        it("returns empty arrays for all lists when the library is empty", async () => {
            const res = await agent.get(`/api/v1/user/${userId}/profile`);

            expect(res.body.currentlyPlaying).toHaveLength(0);
            expect(res.body.completed).toHaveLength(0);
            expect(res.body.recentlyAdded).toHaveLength(0);
        });
    });

    describe("stats — with library data", () => {
        it("returns the correct totalGames count", async () => {
            await addGame(agent, userId, { title: "Game 1" });
            await addGame(agent, userId, { title: "Game 2" });
            await addGame(agent, userId, { title: "Game 3" });

            const res = await agent.get(`/api/v1/user/${userId}/profile`);
            expect(res.body.stats.totalGames).toBe(3);
        });

        it("returns the correct totalHoursPlayed sum", async () => {
            await addGame(agent, userId, { title: "Game 1", hours_played: 10 });
            await addGame(agent, userId, { title: "Game 2", hours_played: 25 });
            await addGame(agent, userId, { title: "Game 3", hours_played: null });

            const res = await agent.get(`/api/v1/user/${userId}/profile`);
            expect(res.body.stats.totalHoursPlayed).toBe(35);
        });

        it("returns the correct completionRate percentage", async () => {
            await addGame(agent, userId, { title: "Game 1", status: "completed" });
            await addGame(agent, userId, { title: "Game 2", status: "completed" });
            await addGame(agent, userId, { title: "Game 3", status: "playing" });
            await addGame(agent, userId, { title: "Game 4", status: null });

            const res = await agent.get(`/api/v1/user/${userId}/profile`);
            // 2 completed out of 3 with a status = 67%
            expect(res.body.stats.completionRate).toBe(67);
        });

        it("returns 100 completionRate when all games with a status are completed", async () => {
            await addGame(agent, userId, { title: "Game 1", status: "completed" });
            await addGame(agent, userId, { title: "Game 2", status: "completed" });

            const res = await agent.get(`/api/v1/user/${userId}/profile`);
            expect(res.body.stats.completionRate).toBe(100);
        });

        it("returns the correct averageRating", async () => {
            await addGame(agent, userId, { title: "Game 1", rating: 4 });
            await addGame(agent, userId, { title: "Game 2", rating: 5 });
            await addGame(agent, userId, { title: "Game 3", rating: null });

            const res = await agent.get(`/api/v1/user/${userId}/profile`);
            expect(res.body.stats.averageRating).toBe(4.5);
        });

        it("returns null averageRating when no games are rated", async () => {
            await addGame(agent, userId, { title: "Game 1", rating: null });

            const res = await agent.get(`/api/v1/user/${userId}/profile`);
            expect(res.body.stats.averageRating).toBeNull();
        });

        it("returns the most common genre as mostPlayedGenre", async () => {
            await addGame(agent, userId, { title: "Game 1", genre: "action" });
            await addGame(agent, userId, { title: "Game 2", genre: "action" });
            await addGame(agent, userId, { title: "Game 3", genre: "indie" });

            const res = await agent.get(`/api/v1/user/${userId}/profile`);
            expect(res.body.stats.mostPlayedGenre).toBe("action");
        });

        it("returns null mostPlayedGenre when no games have a genre set", async () => {
            await addGame(agent, userId, { title: "Game 1", genre: null });
            await addGame(agent, userId, { title: "Game 2", genre: null });

            const res = await agent.get(`/api/v1/user/${userId}/profile`);
            expect(res.body.stats.mostPlayedGenre).toBeNull();
        });

        it("returns the the total amount spent as totalSpent", async () => {
            await addGame(agent, userId, { title: "Game 1", price: "59.99" });
            await addGame(agent, userId, { title: "Game 2", price: "29.99" });
            await addGame(agent, userId, { title: "Game 3", price: null });

            const res = await agent.get(`/api/v1/user/${userId}/profile`);
            expect(res.body.stats.totalSpent).toBe(89.98);
        });

        it("returns null totalSpent when no games have a price set", async () => {
            await addGame(agent, userId, { title: "Game 1", price: null });
            await addGame(agent, userId, { title: "Game 2", price: null });

            const res = await agent.get(`/api/v1/user/${userId}/profile`);
            expect(res.body.stats.totalSpent).toBeNull();
        });
    });

    describe("derived lists", () => {
        it("currentlyPlaying contains only games with status playing", async () => {
            await addGame(agent, userId, { title: "Playing Game", status: "playing" });
            await addGame(agent, userId, { title: "Completed Game", status: "completed" });
            await addGame(agent, userId, { title: "Paused Game", status: "paused" });

            const res = await agent.get(`/api/v1/user/${userId}/profile`);

            expect(res.body.currentlyPlaying).toHaveLength(1);
            expect(res.body.currentlyPlaying[0].title).toBe("Playing Game");
        });

        it("completed contains only games with status completed", async () => {
            await addGame(agent, userId, { title: "Playing Game", status: "playing" });
            await addGame(agent, userId, { title: "First Completed", status: "completed" });
            await addGame(agent, userId, { title: "Second Completed", status: "completed" });

            const res = await agent.get(`/api/v1/user/${userId}/profile`);

            expect(res.body.completed).toHaveLength(2);
            const titles = res.body.completed.map((g: { title: string }) => g.title);
            expect(titles).toContain("First Completed");
            expect(titles).toContain("Second Completed");
        });

        it("recentlyAdded returns at most 6 games", async () => {
            for (let i = 1; i <= 8; i++) {
                await addGame(agent, userId, { title: `Game ${i}` });
            }

            const res = await agent.get(`/api/v1/user/${userId}/profile`);
            expect(res.body.recentlyAdded).toHaveLength(6);
        });

        it("recentlyAdded returns all games when library has fewer than 6", async () => {
            await addGame(agent, userId, { title: "Game 1" });
            await addGame(agent, userId, { title: "Game 2" });

            const res = await agent.get(`/api/v1/user/${userId}/profile`);
            expect(res.body.recentlyAdded).toHaveLength(2);
        });

        it("recentlyAdded includes games of any status", async () => {
            await addGame(agent, userId, { title: "Playing", status: "playing" });
            await addGame(agent, userId, { title: "Completed", status: "completed" });
            await addGame(agent, userId, { title: "Wishlist", status: "wishlist" });

            const res = await agent.get(`/api/v1/user/${userId}/profile`);
            expect(res.body.recentlyAdded).toHaveLength(3);
        });
    });

    describe("bio", () => {
        it("returns null bio by default", async () => {
            const res = await agent.get(`/api/v1/user/${userId}/profile`);
            expect(res.body.bio).toBeNull();
        });

        it("returns the updated bio after a PATCH", async () => {
            await agent.patch(`/api/v1/user/${userId}`).send({ bio: "Just here to game." });

            const res = await agent.get(`/api/v1/user/${userId}/profile`);
            expect(res.body.bio).toBe("Just here to game.");
        });
    });
});
