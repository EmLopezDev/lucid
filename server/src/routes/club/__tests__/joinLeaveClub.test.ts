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
let memberAgent: Awaited<ReturnType<typeof createAuthenticatedAgent>>["agent"];
let clubId: string;

beforeEach(async () => {
    await clearDatabase();
    ({ agent: ownerAgent } = await createAuthenticatedAgent());
    ({ agent: memberAgent } = await createAuthenticatedAgent({ email: "member@example.com" }));

    const res = await ownerAgent
        .post("/api/v1/clubs")
        .send({ name: "Public Club", visibility: "public" });
    clubId = res.body._id;
});

describe("PATCH /api/v1/clubs/:clubId/join (public club)", () => {
    it("returns 401 when not authenticated", async () => {
        const res = await request(app).patch(`/api/v1/clubs/${clubId}/join`);

        expect(res.status).toBe(401);
    });

    it("returns 200 and adds the user to members", async () => {
        const res = await memberAgent.patch(`/api/v1/clubs/${clubId}/join`);

        expect(res.status).toBe(200);
        expect(res.body.members.some((m: { _id: string }) => m._id)).toBe(true);
    });

    it("returns 404 when the club does not exist", async () => {
        const res = await memberAgent.patch("/api/v1/clubs/000000000000000000000001/join");

        expect(res.status).toBe(404);
    });

    it("is idempotent — joining twice does not duplicate the member", async () => {
        await memberAgent.patch(`/api/v1/clubs/${clubId}/join`);
        const res = await memberAgent.patch(`/api/v1/clubs/${clubId}/join`);

        expect(res.status).toBe(200);
        const memberIds = res.body.members.map((m: { _id: string }) => m._id);
        const unique = new Set(memberIds);
        expect(unique.size).toBe(memberIds.length);
    });
});

describe("PATCH /api/v1/clubs/:clubId/leave", () => {
    beforeEach(async () => {
        await memberAgent.patch(`/api/v1/clubs/${clubId}/join`);
    });

    it("returns 401 when not authenticated", async () => {
        const res = await request(app).patch(`/api/v1/clubs/${clubId}/leave`);

        expect(res.status).toBe(401);
    });

    it("returns 200 and removes the user from members", async () => {
        const res = await memberAgent.patch(`/api/v1/clubs/${clubId}/leave`);

        expect(res.status).toBe(200);
        expect(res.body.members.every((m: { _id: string }) => m._id !== "member@example.com")).toBe(true);
    });

    it("returns 404 when the club does not exist", async () => {
        const res = await memberAgent.patch("/api/v1/clubs/000000000000000000000001/leave");

        expect(res.status).toBe(404);
    });
});
