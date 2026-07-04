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
let nonOwnerAgent: Awaited<ReturnType<typeof createAuthenticatedAgent>>["agent"];
let clubId: string;

beforeEach(async () => {
    await clearDatabase();
    ({ agent: ownerAgent } = await createAuthenticatedAgent());
    ({ agent: nonOwnerAgent } = await createAuthenticatedAgent({ email: "other@example.com" }));

    const res = await ownerAgent
        .post("/api/v1/clubs")
        .send({ name: "Test Club", visibility: "public" });
    clubId = res.body._id;
});

describe("DELETE /api/v1/clubs/:clubId", () => {
    it("returns 401 when not authenticated", async () => {
        const res = await request(app).delete(`/api/v1/clubs/${clubId}`);

        expect(res.status).toBe(401);
    });

    it("returns 403 when a non-owner tries to delete", async () => {
        const res = await nonOwnerAgent.delete(`/api/v1/clubs/${clubId}`);

        expect(res.status).toBe(403);
    });

    it("returns 204 when the owner deletes the club", async () => {
        const res = await ownerAgent.delete(`/api/v1/clubs/${clubId}`);

        expect(res.status).toBe(204);
    });

    it("soft-deletes the club (sets deleted_at, does not remove from DB)", async () => {
        await ownerAgent.delete(`/api/v1/clubs/${clubId}`);

        const club = await ClubModel.findById(clubId).lean();
        expect(club).not.toBeNull();
        expect(club?.deleted_at).not.toBeNull();
    });

    it("returns 404 after deletion", async () => {
        await ownerAgent.delete(`/api/v1/clubs/${clubId}`);

        const res = await ownerAgent.get(`/api/v1/clubs/${clubId}`);
        expect(res.status).toBe(404);
    });
});
