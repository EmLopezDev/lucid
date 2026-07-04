import { vi, describe, it, expect, beforeEach } from "vitest";
import { clearDatabase } from "../../../test-helpers/db";
import { createAuthenticatedAgent } from "../../../test-helpers/auth";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return { default: { create: () => new session.default.MemoryStore() } };
});

import request from "supertest";
import app from "../../../app";

let agent: Awaited<ReturnType<typeof createAuthenticatedAgent>>["agent"];
let userId: string;

beforeEach(async () => {
    await clearDatabase();
    ({ agent, userId } = await createAuthenticatedAgent());
});

describe("POST /api/v1/clubs", () => {
    it("returns 401 when not authenticated", async () => {
        const res = await request(app)
            .post("/api/v1/clubs")
            .send({ name: "Test Club", visibility: "public" });

        expect(res.status).toBe(401);
    });

    it("returns 201 with the created public club", async () => {
        const res = await agent
            .post("/api/v1/clubs")
            .send({ name: "Test Club", visibility: "public" });

        expect(res.status).toBe(201);
        expect(res.body.name).toBe("Test Club");
        expect(res.body.visibility).toBe("public");
        expect(res.body.owner).toBe(userId);
        expect(res.body.invite_code).toBeNull();
    });

    it("returns 201 with an invite code for a private club", async () => {
        const res = await agent
            .post("/api/v1/clubs")
            .send({ name: "Secret Club", visibility: "private" });

        expect(res.status).toBe(201);
        expect(res.body.visibility).toBe("private");
        expect(res.body.invite_code).toBeTruthy();
        expect(res.body.invite_code_expires_at).toBeTruthy();
    });

    it("adds the creator as the first member", async () => {
        const res = await agent
            .post("/api/v1/clubs")
            .send({ name: "Test Club", visibility: "public" });

        expect(res.status).toBe(201);
        expect(res.body.members.some((m: { _id: string }) => m._id === userId)).toBe(true);
    });

    it("returns 400 when name is missing", async () => {
        const res = await agent.post("/api/v1/clubs").send({ visibility: "public" });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid fields");
    });

    it("returns 400 when name is too short", async () => {
        const res = await agent
            .post("/api/v1/clubs")
            .send({ name: "Hi", visibility: "public" });

        expect(res.status).toBe(400);
    });

    it("returns 400 when name is too long", async () => {
        const res = await agent
            .post("/api/v1/clubs")
            .send({ name: "A".repeat(51), visibility: "public" });

        expect(res.status).toBe(400);
    });

    it("returns 400 when visibility is invalid", async () => {
        const res = await agent
            .post("/api/v1/clubs")
            .send({ name: "Test Club", visibility: "secret" });

        expect(res.status).toBe(400);
    });

    it("returns 400 when visibility is missing", async () => {
        const res = await agent.post("/api/v1/clubs").send({ name: "Test Club" });

        expect(res.status).toBe(400);
    });
});
