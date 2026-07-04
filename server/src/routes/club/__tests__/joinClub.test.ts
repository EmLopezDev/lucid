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

let ownerAgent: Awaited<ReturnType<typeof createAuthenticatedAgent>>["agent"];
let memberAgent: Awaited<ReturnType<typeof createAuthenticatedAgent>>["agent"];
let clubId: string;
let inviteCode: string;

beforeEach(async () => {
    await clearDatabase();
    ({ agent: ownerAgent } = await createAuthenticatedAgent());
    ({ agent: memberAgent } = await createAuthenticatedAgent({ email: "member@example.com" }));

    const res = await ownerAgent.post("/api/v1/clubs").send({
        name: "Private Club",
        visibility: "private",
    });
    clubId = res.body._id;
    inviteCode = res.body.invite_code;
});

describe("PATCH /api/v1/clubs/:clubId/join", () => {
    it("returns 401 when not authenticated", async () => {
        const res = await request(app)
            .patch(`/api/v1/clubs/${clubId}/join`)
            .send({ invite_code: inviteCode });

        expect(res.status).toBe(401);
    });

    it("allows joining a private club with a valid invite code", async () => {
        const res = await memberAgent
            .patch(`/api/v1/clubs/${clubId}/join`)
            .send({ invite_code: inviteCode });

        expect(res.status).toBe(200);
        expect(res.body.members.some((m: { _id: string }) => m._id)).toBe(true);
    });

    it("returns 403 for an invalid invite code", async () => {
        const res = await memberAgent
            .patch(`/api/v1/clubs/${clubId}/join`)
            .send({ invite_code: "wrongcode" });

        expect(res.status).toBe(403);
    });

    it("returns 403 for an expired invite code", async () => {
        await ClubModel.updateOne(
            { _id: clubId },
            { invite_code_expires_at: new Date(Date.now() - 1000) },
        );

        const res = await memberAgent
            .patch(`/api/v1/clubs/${clubId}/join`)
            .send({ invite_code: inviteCode });

        expect(res.status).toBe(403);
    });

    it("returns 404 when club does not exist", async () => {
        const res = await memberAgent
            .patch("/api/v1/clubs/000000000000000000000001/join")
            .send({ invite_code: inviteCode });

        expect(res.status).toBe(404);
    });
});
