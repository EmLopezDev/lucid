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
let inviteCode: string;

beforeEach(async () => {
    await clearDatabase();
    ({ agent: ownerAgent } = await createAuthenticatedAgent());
    ({ agent: memberAgent } = await createAuthenticatedAgent({ email: "member@example.com" }));

    await ownerAgent.post("/api/v1/clubs").send({ name: "Public Club", visibility: "public" });

    const privateRes = await ownerAgent
        .post("/api/v1/clubs")
        .send({ name: "Private Club", visibility: "private" });
    inviteCode = privateRes.body.invite_code;
});

describe("GET /api/v1/clubs", () => {
    it("returns public clubs without authentication", async () => {
        const res = await request(app).get("/api/v1/clubs");

        expect(res.status).toBe(200);
        expect(res.body.some((c: { name: string }) => c.name === "Public Club")).toBe(true);
    });

    it("does not return private clubs to unauthenticated users", async () => {
        const res = await request(app).get("/api/v1/clubs");

        expect(res.status).toBe(200);
        expect(res.body.some((c: { name: string }) => c.name === "Private Club")).toBe(false);
    });

    it("returns private clubs to the owner", async () => {
        const res = await ownerAgent.get("/api/v1/clubs");

        expect(res.status).toBe(200);
        expect(res.body.some((c: { name: string }) => c.name === "Private Club")).toBe(true);
    });

    it("does not return private clubs to non-members", async () => {
        const res = await memberAgent.get("/api/v1/clubs");

        expect(res.status).toBe(200);
        expect(res.body.some((c: { name: string }) => c.name === "Private Club")).toBe(false);
    });

    it("returns private clubs to members after joining", async () => {
        const privateRes = await ownerAgent.get("/api/v1/clubs");
        const privateClubId = privateRes.body.find(
            (c: { name: string }) => c.name === "Private Club",
        )?._id;

        await memberAgent
            .patch(`/api/v1/clubs/${privateClubId}/join`)
            .send({ invite_code: inviteCode });

        const res = await memberAgent.get("/api/v1/clubs");
        expect(res.body.some((c: { name: string }) => c.name === "Private Club")).toBe(true);
    });

    it("returns an empty array when no clubs exist", async () => {
        await clearDatabase();
        const res = await request(app).get("/api/v1/clubs");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
});
