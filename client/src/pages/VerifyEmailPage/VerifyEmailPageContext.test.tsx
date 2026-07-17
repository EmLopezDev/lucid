import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { VerifyEmailPageProvider } from "./VerifyEmailPageContext";
import { useVerifyEmailPageContext } from "./useVerifyEmailPageContext";
import { createQueryWrapper } from "../../tests/createQueryWrapper";

const mockUseSearchParams = vi.hoisted(() => vi.fn());

vi.mock("react-router", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react-router")>();
    return {
        ...actual,
        useSearchParams: () => mockUseSearchParams(),
    };
});

const wrapper = createQueryWrapper(VerifyEmailPageProvider);

describe("VerifyEmailPageContext", () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    it("returns no_token status and does not fetch when there is no token", () => {
        mockUseSearchParams.mockReturnValue([new URLSearchParams(), vi.fn()]);

        const { result } = renderHook(() => useVerifyEmailPageContext(), { wrapper });

        expect(result.current.status).toBe("no_token");
        expect(result.current.errorMessage).toBeNull();
        expect(globalThis.fetch).not.toHaveBeenCalled();
    });

    it("starts with loading status when a token is present", () => {
        mockUseSearchParams.mockReturnValue([new URLSearchParams("token=abc123"), vi.fn()]);
        (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        const { result } = renderHook(() => useVerifyEmailPageContext(), { wrapper });

        expect(result.current.status).toBe("loading");
    });

    it("sets success status when verification succeeds", async () => {
        mockUseSearchParams.mockReturnValue([new URLSearchParams("token=abc123"), vi.fn()]);
        (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        const { result } = renderHook(() => useVerifyEmailPageContext(), { wrapper });

        await waitFor(() => expect(result.current.status).toBe("success"));
        expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining("/auth/verify-email?token=abc123"));
        expect(result.current.errorMessage).toBeNull();
    });

    it("sets error status with the server's message when verification fails", async () => {
        mockUseSearchParams.mockReturnValue([new URLSearchParams("token=expired"), vi.fn()]);
        (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: "This link has expired" }),
        });

        const { result } = renderHook(() => useVerifyEmailPageContext(), { wrapper });

        await waitFor(() => expect(result.current.status).toBe("error"));
        expect(result.current.errorMessage).toBe("This link has expired");
    });

    it("falls back to a generic error message when the server response has none", async () => {
        mockUseSearchParams.mockReturnValue([new URLSearchParams("token=bad"), vi.fn()]);
        (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: false,
            json: async () => ({}),
        });

        const { result } = renderHook(() => useVerifyEmailPageContext(), { wrapper });

        await waitFor(() => expect(result.current.status).toBe("error"));
        expect(result.current.errorMessage).toBe("Verification failed");
    });

    it("sets error status when the fetch itself throws", async () => {
        mockUseSearchParams.mockReturnValue([new URLSearchParams("token=abc123"), vi.fn()]);
        (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("Network error"));

        const { result } = renderHook(() => useVerifyEmailPageContext(), { wrapper });

        await waitFor(() => expect(result.current.status).toBe("error"));
        expect(result.current.errorMessage).toBe("Network error");
    });
});
