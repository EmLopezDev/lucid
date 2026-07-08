import { vi, describe, it, expect, beforeEach } from "vitest";
import { clearDatabase } from "../../../test-helpers/db";
import { createAuthenticatedAgent } from "../../../test-helpers/auth";

vi.mock("connect-mongo", async () => {
    const session = await import("express-session");
    return { default: { create: () => new session.default.MemoryStore() } };
});

import request from "supertest";
import app from "../../../app";

let memberAgent: Awaited<ReturnType<typeof createAuthenticatedAgent>>["agent"];
let nonMemberAgent: Awaited<ReturnType<typeof createAuthenticatedAgent>>["agent"];
let clubId: string;
let postId: string;

beforeEach(async () => {
    await clearDatabase();
    ({ agent: memberAgent } = await createAuthenticatedAgent());
    ({ agent: nonMemberAgent } = await createAuthenticatedAgent({ email: "other@example.com" }));

    const clubRes = await memberAgent.post("/api/v1/clubs").send({
        name: "Posts Test Club",
        visibility: "public",
    });
    clubId = clubRes.body._id;

    const postRes = await memberAgent
        .post(`/api/v1/clubs/${clubId}/posts`)
        .send({ content: "Initial post", is_spoiler: false });
    postId = postRes.body._id;
});

describe("GET /api/v1/clubs/:clubId/posts", () => {
    it("returns 200 with posts array for unauthenticated user", async () => {
        const res = await request(app).get(`/api/v1/clubs/${clubId}/posts`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.posts)).toBe(true);
    });

    it("returns posts sorted newest first", async () => {
        await memberAgent
            .post(`/api/v1/clubs/${clubId}/posts`)
            .send({ content: "Second post", is_spoiler: false });

        const res = await memberAgent.get(`/api/v1/clubs/${clubId}/posts`);

        expect(res.status).toBe(200);
        expect(res.body.posts.length).toBe(2);
        expect(res.body.posts[0].content).toBe("Second post");
        expect(res.body.posts[1].content).toBe("Initial post");
    });

    it("excludes soft-deleted posts", async () => {
        await memberAgent.delete(`/api/v1/clubs/${clubId}/posts/${postId}`);

        const res = await memberAgent.get(`/api/v1/clubs/${clubId}/posts`);

        expect(res.status).toBe(200);
        expect(res.body.posts.length).toBe(0);
    });

    it("returns empty array when club has no posts", async () => {
        await memberAgent.delete(`/api/v1/clubs/${clubId}/posts/${postId}`);

        const res = await request(app).get(`/api/v1/clubs/${clubId}/posts`);

        expect(res.status).toBe(200);
        expect(res.body.posts).toEqual([]);
        expect(res.body.nextCursor).toBeNull();
    });

    it("respects the limit query param and returns a nextCursor when more posts remain", async () => {
        await memberAgent
            .post(`/api/v1/clubs/${clubId}/posts`)
            .send({ content: "Second post", is_spoiler: false });
        await memberAgent
            .post(`/api/v1/clubs/${clubId}/posts`)
            .send({ content: "Third post", is_spoiler: false });

        const res = await memberAgent.get(`/api/v1/clubs/${clubId}/posts?limit=2`);

        expect(res.status).toBe(200);
        expect(res.body.posts.length).toBe(2);
        expect(res.body.posts[0].content).toBe("Third post");
        expect(res.body.posts[1].content).toBe("Second post");
        expect(res.body.nextCursor).toBe(res.body.posts[1]._id);
    });

    it("paginates through all posts using the before cursor with no duplicates or gaps", async () => {
        await memberAgent
            .post(`/api/v1/clubs/${clubId}/posts`)
            .send({ content: "Second post", is_spoiler: false });
        await memberAgent
            .post(`/api/v1/clubs/${clubId}/posts`)
            .send({ content: "Third post", is_spoiler: false });

        const firstPage = await memberAgent.get(`/api/v1/clubs/${clubId}/posts?limit=2`);
        expect(firstPage.body.posts.map((p: { content: string }) => p.content)).toEqual([
            "Third post",
            "Second post",
        ]);
        expect(firstPage.body.nextCursor).not.toBeNull();

        const secondPage = await memberAgent.get(
            `/api/v1/clubs/${clubId}/posts?limit=2&before=${firstPage.body.nextCursor}`,
        );
        expect(secondPage.body.posts.map((p: { content: string }) => p.content)).toEqual([
            "Initial post",
        ]);
        expect(secondPage.body.nextCursor).toBeNull();
    });

    it("falls back to the default limit when an invalid limit is given", async () => {
        const res = await memberAgent.get(`/api/v1/clubs/${clubId}/posts?limit=not-a-number`);

        expect(res.status).toBe(200);
        expect(res.body.posts.length).toBe(1);
    });
});

describe("POST /api/v1/clubs/:clubId/posts", () => {
    it("returns 401 for unauthenticated user", async () => {
        const res = await request(app)
            .post(`/api/v1/clubs/${clubId}/posts`)
            .send({ content: "Unauthorized post", is_spoiler: false });

        expect(res.status).toBe(401);
    });

    it("returns 201 for a non-member of a public club", async () => {
        const res = await nonMemberAgent
            .post(`/api/v1/clubs/${clubId}/posts`)
            .send({ content: "Non-member post", is_spoiler: false });

        expect(res.status).toBe(201);
    });

    it("returns 201 with created post", async () => {
        const res = await memberAgent
            .post(`/api/v1/clubs/${clubId}/posts`)
            .send({ content: "New post content", is_spoiler: false });

        expect(res.status).toBe(201);
        expect(res.body.content).toBe("New post content");
        expect(res.body.is_spoiler).toBe(false);
        expect(res.body.club_id).toBe(clubId);
        expect(res.body._id).toBeDefined();
        expect(res.body.deleted_at).toBeNull();
    });

    it("returns 201 with spoiler post", async () => {
        const res = await memberAgent
            .post(`/api/v1/clubs/${clubId}/posts`)
            .send({ content: "Spoiler content", is_spoiler: true });

        expect(res.status).toBe(201);
        expect(res.body.is_spoiler).toBe(true);
    });

    it("returns 400 when content is missing", async () => {
        const res = await memberAgent
            .post(`/api/v1/clubs/${clubId}/posts`)
            .send({ is_spoiler: false });

        expect(res.status).toBe(400);
    });
});

describe("PATCH /api/v1/clubs/:clubId/posts/:postId", () => {
    it("returns 401 for unauthenticated user", async () => {
        const res = await request(app)
            .patch(`/api/v1/clubs/${clubId}/posts/${postId}`)
            .send({ content: "Updated" });

        expect(res.status).toBe(401);
    });

    it("returns 200 with updated post content", async () => {
        const res = await memberAgent
            .patch(`/api/v1/clubs/${clubId}/posts/${postId}`)
            .send({ content: "Updated content" });

        expect(res.status).toBe(200);
        expect(res.body.content).toBe("Updated content");
        expect(res.body.updated_at).not.toBeNull();
    });

    it("returns 200 with updated spoiler flag", async () => {
        const res = await memberAgent
            .patch(`/api/v1/clubs/${clubId}/posts/${postId}`)
            .send({ is_spoiler: true });

        expect(res.status).toBe(200);
        expect(res.body.is_spoiler).toBe(true);
    });
});

describe("DELETE /api/v1/clubs/:clubId/posts/:postId", () => {
    it("returns 401 for unauthenticated user", async () => {
        const res = await request(app).delete(`/api/v1/clubs/${clubId}/posts/${postId}`);

        expect(res.status).toBe(401);
    });

    it("returns 204 on successful delete", async () => {
        const res = await memberAgent.delete(`/api/v1/clubs/${clubId}/posts/${postId}`);

        expect(res.status).toBe(204);
    });

    it("soft-deletes the post — post is excluded from GET posts after deletion", async () => {
        await memberAgent.delete(`/api/v1/clubs/${clubId}/posts/${postId}`);

        const res = await memberAgent.get(`/api/v1/clubs/${clubId}/posts`);

        expect(res.body.posts.length).toBe(0);
    });
});
