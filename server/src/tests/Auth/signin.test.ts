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

describe("POST /api/v1/auth/signin", () => {
    it("returns 200 and the user on valid credentials", async () => {
        await request(app).post("/api/v1/auth/register").send(testUser);
        const res = await request(app).post("/api/v1/auth/signin").send({
            email: testUser.email,
            password: testUser.password,
        });

        expect(res.status).toBe(200);
        expect(res.body.email).toBe(testUser.email);
        expect(res.body.password).toBeUndefined();
        expect(res.body.hash).toBeUndefined();
    });

    it("returns 400 when the password is incorrect", async () => {
        await request(app).post("/api/v1/auth/register").send(testUser);
        const res = await request(app).post("/api/v1/auth/signin").send({
            email: testUser.email,
            password: "wrongpassword",
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toBeDefined();
    });

    it("returns 400 when the user does not exist", async () => {
        const res = await request(app).post("/api/v1/auth/signin").send({
            email: "nobody@example.com",
            password: "password123",
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toBeDefined();
    });

    it("returns 404 when required fields are missing", async () => {
        const res = await request(app).post("/api/v1/auth/signin").send({
            email: "test@example.com",
        });

        expect(res.status).toBe(404);
    });
});
