import { vi } from "vitest";
import request from "supertest";
import app from "../../app";
import { sendPasswordResetEmail, sendEmailVerificationEmail } from "@services/email";
import { UserModel } from "@models/user/user.mongo";

const testUser = {
    first_name: "Test",
    last_name: "User",
    email: "test@example.com",
    password: "password123",
};

export async function verifyTestUser(email: string): Promise<void> {
    await UserModel.updateOne({ email }, { $set: { email_verified: true } });
}

export function getVerificationToken(): string {
    const [, verifyUrl] = vi.mocked(sendEmailVerificationEmail).mock.lastCall!;
    return new URL(verifyUrl).searchParams.get("token")!;
}

export async function getResetToken(email: string): Promise<string> {
    await request(app).post("/api/v1/auth/forgot-password").send({ email });
    const [, resetUrl] = vi.mocked(sendPasswordResetEmail).mock.lastCall!;
    return new URL(resetUrl).searchParams.get("token")!;
}

export async function createAuthenticatedAgent(overrides: Partial<typeof testUser> = {}) {
    const user = { ...testUser, ...overrides };
    const agent = request.agent(app);
    await agent.post("/api/v1/auth/register").send(user);
    await verifyTestUser(user.email);
    const signInRes = await agent.post("/api/v1/auth/signin").send({
        email: user.email,
        password: user.password,
    });
    return { agent, userId: signInRes.body._id as string };
}
