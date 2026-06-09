import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return { default: { create: () => new session.default.MemoryStore() } };
});

import request from "supertest";
import app from "../../../app";
import { AuthModel } from "../../../models/auth/auth.mongo";
import { UserLibraryModel } from "../../../models/user-library/user-library.mongo";
import { UserModel } from "../../../models/user/user.mongo";
import { clearDatabase } from "../../../test-helpers/db";
import { createAuthenticatedAgent, verifyTestUser } from "../../../test-helpers/auth";

let agent: Awaited<ReturnType<typeof createAuthenticatedAgent>>["agent"];
let userId: string;

beforeEach(async () => {
    await clearDatabase();
    ({ agent, userId } = await createAuthenticatedAgent());
});

describe("DELETE /api/v1/user/:userId", () => {
    it("returns 204 and removes the user, auth, and library records", async () => {
        await UserLibraryModel.create({
            user_id: userId,
            title: "Test Game",
            genre: "action",
            platform: "PC",
            status: "playing",
            favorite: false,
            hours_played: 10,
            rating: null,
            price: null,
            date_purchased: null,
            date_played: null,
            comment: null,
            cover_url: null,
            created_at: new Date(),
            updated_at: null,
            deleted_at: null,
        });

        const res = await agent.delete(`/api/v1/user/${userId}`);

        expect(res.status).toBe(204);
        expect(await UserModel.findById(userId)).toBeNull();
        expect(await AuthModel.findOne({ user_id: userId })).toBeNull();
        expect(await UserLibraryModel.find({ user_id: userId })).toHaveLength(0);
    });

    it("returns 401 when not authenticated", async () => {
        const res = await request(app).delete(`/api/v1/user/${userId}`);
        expect(res.status).toBe(401);
    });

    it("returns 403 when deleting another user's account", async () => {
        const { userId: otherUserId } = await createAuthenticatedAgent({
            email: "other@example.com",
        });

        const res = await agent.delete(`/api/v1/user/${otherUserId}`);
        expect(res.status).toBe(403);
    });

    describe("protected accounts", () => {
        it("returns 403 when deleting the demo account", async () => {
            const demoAgent = request.agent(app);
            await demoAgent.post("/api/v1/auth/register").send({
                first_name: "Demo",
                last_name: "User",
                email: "demo@lucid.com",
                password: "lucid-demo",
            });
            await verifyTestUser("demo@lucid.com");
            const signInRes = await demoAgent
                .post("/api/v1/auth/signin")
                .send({ email: "demo@lucid.com", password: "lucid-demo" });
            const demoId = signInRes.body._id as string;

            const res = await demoAgent.delete(`/api/v1/user/${demoId}`);
            expect(res.status).toBe(403);
        });

        it("returns 403 when deleting the dev account", async () => {
            const devAgent = request.agent(app);
            await devAgent.post("/api/v1/auth/register").send({
                first_name: "Dev",
                last_name: "User",
                email: "dev@lucid.com",
                password: "password123",
            });
            await verifyTestUser("dev@lucid.com");
            const signInRes = await devAgent
                .post("/api/v1/auth/signin")
                .send({ email: "dev@lucid.com", password: "password123" });
            const devId = signInRes.body._id as string;

            const res = await devAgent.delete(`/api/v1/user/${devId}`);
            expect(res.status).toBe(403);
        });
    });
});
