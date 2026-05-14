import { vi, describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../app";
import { clearDatabase } from "../helpers/db";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return {
        default: {
            create: () => new session.default.MemoryStore(),
        },
    };
});

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
    it("returns 201 on valid registration", async () => {
        const res = await request(app).post("/api/v1/auth/register").send(testUser);

        expect(res.status).toBe(201);
    });

    it("returns 409 when the email is already registered", async () => {
        await request(app).post("/api/v1/auth/register").send(testUser);
        const res = await request(app).post("/api/v1/auth/register").send(testUser);

        expect(res.status).toBe(409);
        expect(res.body.message).toBeDefined();
    });

    it("returns 400 when required fields are missing", async () => {
        const res = await request(app).post("/api/v1/auth/register").send({
            email: "missing@example.com",
        });

        expect(res.status).toBe(400);
    });

    it("returns 400 when the email format is invalid", async () => {
        const res = await request(app)
            .post("/api/v1/auth/register")
            .send({
                ...testUser,
                email: "not-an-email",
            });

        expect(res.status).toBe(400);
    });
});
