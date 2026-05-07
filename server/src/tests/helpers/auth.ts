import request from "supertest";
import app from "../../app";

const testUser = {
    first_name: "Test",
    last_name: "User",
    email: "test@example.com",
    password: "password123",
};

export async function createAuthenticatedAgent(overrides: Partial<typeof testUser> = {}) {
    const user = { ...testUser, ...overrides };
    const agent = request.agent(app);
    const registered = await agent.post("/api/v1/auth/register").send(user);
    await agent.post("/api/v1/auth/signin").send({
        email: user.email,
        password: user.password,
    });
    return { agent, userId: registered.body._id as string };
}
