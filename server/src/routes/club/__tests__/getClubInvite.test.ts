import { vi, describe, it, expect, beforeEach } from "vitest";
import { clearDatabase } from "../../../test-helpers/db";
import { createAuthenticatedAgent } from "../../../test-helpers/auth";
import { ClubModel } from "../../../models/club/club.mongo";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return { default: { create: () => new session.default.MemoryStore() } };
});

import request from "supertest";
import app from "../../../app";

let agent: Awaited<ReturnType<typeof createAuthenticatedAgent>>["agent"];
let clubId: string;
let inviteCode: string;

beforeEach(async () => {
    await clearDatabase();
    ({ agent } = await createAuthenticatedAgent());

    const res = await agent.post("/api/v1/clubs").send({
        name: "Private Club",
        visibility: "private",
    });
    clubId = res.body._id;
    inviteCode = res.body.invite_code;
});

describe("GET /api/v1/clubs/:clubId/invite", () => {
    it("returns 200 with preview for a valid code", async () => {
        const res = await agent.get(`/api/v1/clubs/${clubId}/invite?code=${inviteCode}`);

        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Private Club");
        expect(res.body.owner).toBeDefined();
        expect(res.body.member_count).toBe(1);
        expect(typeof res.body.is_member).toBe("boolean");
    });

    it("returns is_member true for the club owner", async () => {
        const res = await agent.get(`/api/v1/clubs/${clubId}/invite?code=${inviteCode}`);

        expect(res.status).toBe(200);
        expect(res.body.is_member).toBe(true);
    });

    it("returns is_member false for unauthenticated users", async () => {
        const res = await request(app).get(`/api/v1/clubs/${clubId}/invite?code=${inviteCode}`);

        expect(res.status).toBe(200);
        expect(res.body.is_member).toBe(false);
    });

    it("returns 404 for an invalid code", async () => {
        const res = await agent.get(`/api/v1/clubs/${clubId}/invite?code=invalidcode`);

        expect(res.status).toBe(404);
    });

    it("returns 400 when code param is missing", async () => {
        const res = await agent.get(`/api/v1/clubs/${clubId}/invite`);

        expect(res.status).toBe(400);
    });

    it("returns 404 for an expired invite code", async () => {
        await ClubModel.updateOne(
            { _id: clubId },
            { invite_code_expires_at: new Date(Date.now() - 1000) },
        );

        const res = await agent.get(`/api/v1/clubs/${clubId}/invite?code=${inviteCode}`);

        expect(res.status).toBe(404);
    });

    it("does not require authentication", async () => {
        const res = await request(app).get(`/api/v1/clubs/${clubId}/invite?code=${inviteCode}`);

        expect(res.status).toBe(200);
    });
});
