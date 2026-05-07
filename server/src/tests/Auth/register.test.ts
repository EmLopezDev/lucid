import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return {
        default: {
            create: () => new session.default.MemoryStore(),
        },
    };
});

import request from "supertest";
import app from "../../app";
import { clearDatabase } from "../helpers/db";

const testUser = {
    first_name: "Test",
    last_name: "User",
    email: "test@example.com",
    password: "password123",
};

beforeEach(async () => {
    await clearDatabase();
});

describe("POST /api/v1/auth/register", () => {
    it("returns 200 and the new user on valid registration", async () => {
        const res = await request(app).post("/api/v1/auth/register").send(testUser);

        expect(res.status).toBe(200);
        expect(res.body.email).toBe(testUser.email);
        expect(res.body.first_name).toBe(testUser.first_name);
        expect(res.body.last_name).toBe(testUser.last_name);
        expect(res.body.password).toBeUndefined();
    });

    it("returns 400 when the email is already registered", async () => {
        await request(app).post("/api/v1/auth/register").send(testUser);
        const res = await request(app).post("/api/v1/auth/register").send(testUser);

        expect(res.status).toBe(400);
        expect(res.body.message).toBeDefined();
    });

    it("returns 404 when required fields are missing", async () => {
        const res = await request(app).post("/api/v1/auth/register").send({
            email: "missing@example.com",
        });

        expect(res.status).toBe(404);
    });

    it("returns 404 when the email format is invalid", async () => {
        const res = await request(app).post("/api/v1/auth/register").send({
            ...testUser,
            email: "not-an-email",
        });

        expect(res.status).toBe(404);
    });
});
