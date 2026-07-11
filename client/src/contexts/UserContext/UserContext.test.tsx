import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { toast } from "sonner";
import { UserProvider } from "./UserContext";
import { useUserContext } from "./useUserContext";
import { createQueryWrapper } from "../../tests/createQueryWrapper";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const wrapper = createQueryWrapper(UserProvider);

const mockUser = {
    _id: "1",
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    email_verified: true,
    bio: null,
    created_at: new Date("2026-01-01"),
    updated_at: null,
    deleted_at: null,
};

describe("UserContext", () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    it("starts with isSessionLoading true", () => {
        (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: false,
            json: async () => ({}),
        });
        const { result } = renderHook(() => useUserContext(), { wrapper });
        expect(result.current.isSessionLoading).toBe(true);
    });

    describe("session check", () => {
        it("calls the session endpoint with credentials included", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                json: async () => ({}),
            });
            const { result } = renderHook(() => useUserContext(), { wrapper });
            await waitFor(() => expect(result.current.isSessionLoading).toBe(false));
            expect(globalThis.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/auth/session"),
                expect.objectContaining({ credentials: "include" }),
            );
        });

        it("sets currentUser when the session check succeeds", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => mockUser,
            });
            const { result } = renderHook(() => useUserContext(), { wrapper });
            await waitFor(() => expect(result.current.isSessionLoading).toBe(false));
            expect(result.current.currentUser).toEqual(mockUser);
            expect(result.current.isUserAuthenticated).toBe(true);
        });

        it("sets currentUser to null when not logged in (session check fails)", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: "Unauthorized" }),
            });
            const { result } = renderHook(() => useUserContext(), { wrapper });
            await waitFor(() => expect(result.current.isSessionLoading).toBe(false));
            expect(result.current.currentUser).toBeNull();
            expect(result.current.isUserAuthenticated).toBe(false);
        });

        it("sets currentUser to null when fetch throws", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
                new Error("Network error"),
            );
            const { result } = renderHook(() => useUserContext(), { wrapper });
            await waitFor(() => expect(result.current.isSessionLoading).toBe(false));
            expect(result.current.currentUser).toBeNull();
            expect(result.current.isUserAuthenticated).toBe(false);
        });
    });

    describe("setUser", () => {
        it("updates currentUser", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                json: async () => ({}),
            });
            const { result } = renderHook(() => useUserContext(), { wrapper });
            await waitFor(() => expect(result.current.isSessionLoading).toBe(false));

            act(() => result.current.setUser(mockUser));

            await waitFor(() => expect(result.current.currentUser).toEqual(mockUser));
            expect(result.current.isUserAuthenticated).toBe(true);
        });

        it("clears currentUser when called with null", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => mockUser,
            });
            const { result } = renderHook(() => useUserContext(), { wrapper });
            await waitFor(() => expect(result.current.currentUser).toEqual(mockUser));

            act(() => result.current.setUser(null));

            await waitFor(() => expect(result.current.currentUser).toBeNull());
            expect(result.current.isUserAuthenticated).toBe(false);
        });
    });

    describe("signOut", () => {
        beforeEach(() => {
            (globalThis.fetch as ReturnType<typeof vi.fn>)
                .mockResolvedValueOnce({ ok: true, json: async () => mockUser })
                .mockResolvedValueOnce({ ok: true });
        });

        it("calls the signout endpoint", async () => {
            const { result } = renderHook(() => useUserContext(), { wrapper });
            await waitFor(() => expect(result.current.currentUser).toEqual(mockUser));

            await act(async () => result.current.signOut());

            expect(globalThis.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/auth/signout"),
                expect.objectContaining({ method: "POST", credentials: "include" }),
            );
        });

        it("clears currentUser and shows a success toast", async () => {
            const { result } = renderHook(() => useUserContext(), { wrapper });
            await waitFor(() => expect(result.current.currentUser).toEqual(mockUser));

            await act(async () => result.current.signOut());

            await waitFor(() => expect(result.current.currentUser).toBeNull());
            expect(result.current.isUserAuthenticated).toBe(false);
            expect(toast.success).toHaveBeenCalledWith("Signed out. Your save file is safe.");
        });
    });
});
