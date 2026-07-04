import { vi, describe, it, expect, beforeEach } from "vitest";
import { clearDatabase } from "../../../test-helpers/db";
import { createAuthenticatedAgent } from "../../../test-helpers/auth";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return { default: { create: () => new session.default.MemoryStore() } };
});

import request from "supertest";
import app from "../../../app";

let ownerAgent: Awaited<ReturnType<typeof createAuthenticatedAgent>>["agent"];
let nonMemberAgent: Awaited<ReturnType<typeof createAuthenticatedAgent>>["agent"];
let publicClubId: string;
let privateClubId: string;
let inviteCode: string;

beforeEach(async () => {
    await clearDatabase();
    ({ agent: ownerAgent } = await createAuthenticatedAgent());
    ({ agent: nonMemberAgent } = await createAuthenticatedAgent({ email: "other@example.com" }));

    const publicRes = await ownerAgent.post("/api/v1/clubs").send({
        name: "Public Club",
        visibility: "public",
    });
    publicClubId = publicRes.body._id;

    const privateRes = await ownerAgent.post("/api/v1/clubs").send({
        name: "Private Club",
        visibility: "private",
    });
    privateClubId = privateRes.body._id;
    inviteCode = privateRes.body.invite_code;
});

describe("GET /api/v1/clubs/:clubId", () => {
    it("returns 200 for a public club without authentication", async () => {
        const res = await request(app).get(`/api/v1/clubs/${publicClubId}`);

        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Public Club");
    });

    it("returns 200 for a private club for the owner", async () => {
        const res = await ownerAgent.get(`/api/v1/clubs/${privateClubId}`);

        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Private Club");
    });

    it("returns 403 for a private club for a non-member", async () => {
        const res = await nonMemberAgent.get(`/api/v1/clubs/${privateClubId}`);

        expect(res.status).toBe(403);
    });

    it("returns 403 for a private club when unauthenticated", async () => {
        const res = await request(app).get(`/api/v1/clubs/${privateClubId}`);

        expect(res.status).toBe(403);
    });

    it("returns 200 for a private club after joining", async () => {
        await nonMemberAgent
            .patch(`/api/v1/clubs/${privateClubId}/join`)
            .send({ invite_code: inviteCode });

        const res = await nonMemberAgent.get(`/api/v1/clubs/${privateClubId}`);

        expect(res.status).toBe(200);
    });

    it("returns invite_code only for the owner", async () => {
        await nonMemberAgent
            .patch(`/api/v1/clubs/${privateClubId}/join`)
            .send({ invite_code: inviteCode });

        const ownerRes = await ownerAgent.get(`/api/v1/clubs/${privateClubId}`);
        const memberRes = await nonMemberAgent.get(`/api/v1/clubs/${privateClubId}`);

        expect(ownerRes.body.invite_code).toBeTruthy();
        expect(memberRes.body.invite_code).toBeNull();
    });

    it("returns 404 for a non-existent club", async () => {
        const res = await request(app).get("/api/v1/clubs/000000000000000000000001");

        expect(res.status).toBe(404);
    });
});
