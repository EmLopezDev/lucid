import { vi, describe, it, expect, beforeEach } from "vitest";
import { clearDatabase } from "../../../test-helpers/db";
import { createAuthenticatedAgent } from "../../../test-helpers/auth";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return { default: { create: () => new session.default.MemoryStore() } };
});

let agent: Awaited<ReturnType<typeof createAuthenticatedAgent>>["agent"];
let publicClubId: string;
let privateClubId: string;

beforeEach(async () => {
    await clearDatabase();
    ({ agent } = await createAuthenticatedAgent());

    const publicRes = await agent.post("/api/v1/clubs").send({
        name: "Public Club",
        visibility: "public",
    });
    publicClubId = publicRes.body._id;

    const privateRes = await agent.post("/api/v1/clubs").send({
        name: "Private Club",
        visibility: "private",
    });
    privateClubId = privateRes.body._id;
});

describe("PATCH /api/v1/clubs/:clubId — invite code behaviour", () => {
    it("generates an invite code when switching from public to private", async () => {
        const res = await agent
            .patch(`/api/v1/clubs/${publicClubId}`)
            .send({ visibility: "private" });

        expect(res.status).toBe(200);
        expect(res.body.invite_code).toBeTruthy();
        expect(res.body.invite_code_expires_at).toBeTruthy();
    });

    it("clears the invite code when switching from private to public", async () => {
        const res = await agent
            .patch(`/api/v1/clubs/${privateClubId}`)
            .send({ visibility: "public" });

        expect(res.status).toBe(200);
        expect(res.body.invite_code).toBeNull();
        expect(res.body.invite_code_expires_at).toBeNull();
    });

    it("preserves the invite code when editing a private club without changing visibility", async () => {
        const before = await agent.get(`/api/v1/clubs/${privateClubId}`);
        const originalCode = before.body.invite_code;

        const res = await agent
            .patch(`/api/v1/clubs/${privateClubId}`)
            .send({ name: "Renamed Private Club", visibility: "private" });

        expect(res.status).toBe(200);
        expect(res.body.invite_code).toBe(originalCode);
    });
});
