import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useProfileView } from "./useProfileView";

const mockSetUser = vi.hoisted(() => vi.fn());
const mockCurrentUser = {
    _id: "user-1",
    first_name: "Test",
    last_name: "User",
    email: "test@example.com",
    created_at: new Date(),
    updated_at: null,
    deleted_at: null,
};

vi.mock("../../../../contexts/UserContext/useUserContext", () => ({
    useUserContext: () => ({ currentUser: mockCurrentUser, setUser: mockSetUser }),
}));

function inputEvent(name: string, value: string) {
    return { target: { name, value } } as React.ChangeEvent<HTMLInputElement>;
}

function submitEvent() {
    return { preventDefault: vi.fn() } as unknown as React.SubmitEvent<HTMLFormElement>;
}

describe("useProfileView", () => {
    beforeEach(() => {
        mockSetUser.mockReset();
        globalThis.fetch = vi.fn();
    });

    it("starts with form pre-filled from currentUser", () => {
        const { result } = renderHook(() => useProfileView());
        expect(result.current.formData.first_name).toBe("Test");
        expect(result.current.formData.last_name).toBe("User");
        expect(result.current.formData.email).toBe("test@example.com");
    });

    it("starts with no errors and no success", () => {
        const { result } = renderHook(() => useProfileView());
        expect(result.current.errors).toEqual({ first_name: "", last_name: "", email: "" });
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.formError).toBe("");
    });

    describe("validation", () => {
        it("shows required errors when submitting an empty form", async () => {
            const { result } = renderHook(() => useProfileView());
            act(() => {
                result.current.onChange(inputEvent("first_name", ""));
                result.current.onChange(inputEvent("last_name", ""));
                result.current.onChange(inputEvent("email", ""));
            });
            await act(async () => result.current.onSubmit(submitEvent()));
            expect(result.current.errors.first_name).toBe("First name is required");
            expect(result.current.errors.last_name).toBe("Last name is required");
            expect(result.current.errors.email).toBe("Email is required");
        });

        it("shows a name format error for an invalid first name", async () => {
            const { result } = renderHook(() => useProfileView());
            act(() => result.current.onChange(inputEvent("first_name", "John123")));
            await act(async () => result.current.onSubmit(submitEvent()));
            expect(result.current.errors.first_name).toBe("First name should only be letters");
        });

        it("shows an email format error for an invalid email", async () => {
            const { result } = renderHook(() => useProfileView());
            act(() => result.current.onChange(inputEvent("email", "not-an-email")));
            await act(async () => result.current.onSubmit(submitEvent()));
            expect(result.current.errors.email).toBe("Email format is invalid");
        });

        it("does not call fetch when there are validation errors", async () => {
            const { result } = renderHook(() => useProfileView());
            act(() => result.current.onChange(inputEvent("first_name", "")));
            await act(async () => result.current.onSubmit(submitEvent()));
            expect(globalThis.fetch).not.toHaveBeenCalled();
        });
    });

    describe("successful update", () => {
        beforeEach(() => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ ...mockCurrentUser, first_name: "Jane" }),
            });
        });

        it("calls the user endpoint with updated data", async () => {
            const { result } = renderHook(() => useProfileView());
            act(() => result.current.onChange(inputEvent("first_name", "Jane")));
            await act(async () => result.current.onSubmit(submitEvent()));
            await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());
            expect(globalThis.fetch).toHaveBeenCalledWith(
                expect.stringContaining(`/user/${mockCurrentUser._id}`),
                expect.objectContaining({ method: "PATCH" }),
            );
        });

        it("calls setUser with the updated user", async () => {
            const { result } = renderHook(() => useProfileView());
            act(() => result.current.onChange(inputEvent("first_name", "Jane")));
            await act(async () => result.current.onSubmit(submitEvent()));
            await waitFor(() => expect(mockSetUser).toHaveBeenCalled());
            expect(mockSetUser).toHaveBeenCalledWith(
                expect.objectContaining({ first_name: "Jane" }),
            );
        });

        it("sets isSuccess to true", async () => {
            const { result } = renderHook(() => useProfileView());
            await act(async () => result.current.onSubmit(submitEvent()));
            await waitFor(() => expect(result.current.isSuccess).toBe(true));
        });
    });

    describe("failed update", () => {
        it("sets formError from the server message", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: "Something went wrong" }),
            });
            const { result } = renderHook(() => useProfileView());
            await act(async () => result.current.onSubmit(submitEvent()));
            await waitFor(() => expect(result.current.formError).toBe("Something went wrong"));
        });

        it("sets formError when fetch throws", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
                new Error("Network error"),
            );
            const { result } = renderHook(() => useProfileView());
            await act(async () => result.current.onSubmit(submitEvent()));
            await waitFor(() => expect(result.current.formError).toBe("Something went wrong"));
        });
    });

    describe("onReset", () => {
        it("restores form to currentUser data and clears errors", async () => {
            const { result } = renderHook(() => useProfileView());
            act(() => {
                result.current.onChange(inputEvent("first_name", ""));
                result.current.onChange(inputEvent("last_name", ""));
            });
            await act(async () => result.current.onSubmit(submitEvent()));
            expect(result.current.errors.first_name).toBe("First name is required");
            act(() => result.current.onReset());
            expect(result.current.formData.first_name).toBe("Test");
            expect(result.current.errors).toEqual({ first_name: "", last_name: "", email: "" });
            expect(result.current.formError).toBe("");
            expect(result.current.isSuccess).toBe(false);
        });
    });
});
