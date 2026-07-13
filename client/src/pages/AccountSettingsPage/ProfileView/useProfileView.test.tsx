import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useProfileView } from "./useProfileView.js";
import { toast } from "sonner";
import { createQueryWrapper } from "../../../tests/createQueryWrapper";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const wrapper = createQueryWrapper(({ children }) => children);

const mockSetUser = vi.hoisted(() => vi.fn());
const mockNavigate = vi.hoisted(() => vi.fn());

const mockCurrentUser = {
    _id: "user-1",
    first_name: "Test",
    last_name: "User",
    email: "test@example.com",
    bio: null,
    created_at: new Date(),
    updated_at: null,
    deleted_at: null,
};

vi.mock("../../../contexts/UserContext/useUserContext", () => ({
    useUserContext: () => ({ currentUser: mockCurrentUser, setUser: mockSetUser }),
}));

vi.mock("react-router", () => ({
    useNavigate: () => mockNavigate,
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
        mockNavigate.mockReset();
        (toast.success as ReturnType<typeof vi.fn>).mockReset();
        (toast.error as ReturnType<typeof vi.fn>).mockReset();
        globalThis.fetch = vi.fn();
    });

    it("starts with form pre-filled from currentUser", () => {
        const { result } = renderHook(() => useProfileView(), { wrapper });
        expect(result.current.formData.first_name).toBe("Test");
        expect(result.current.formData.last_name).toBe("User");
        expect(result.current.formData.email).toBe("test@example.com");
    });

    it("starts with no errors", () => {
        const { result } = renderHook(() => useProfileView(), { wrapper });
        expect(result.current.errors).toEqual({
            first_name: "",
            last_name: "",
            email: "",
            bio: "",
        });
    });

    describe("validation", () => {
        it("shows required errors when submitting an empty form", async () => {
            const { result } = renderHook(() => useProfileView(), { wrapper });
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
            const { result } = renderHook(() => useProfileView(), { wrapper });
            act(() => result.current.onChange(inputEvent("first_name", "John123")));
            await act(async () => result.current.onSubmit(submitEvent()));
            expect(result.current.errors.first_name).toBe("First name should only be letters");
        });

        it("shows an email format error for an invalid email", async () => {
            const { result } = renderHook(() => useProfileView(), { wrapper });
            act(() => result.current.onChange(inputEvent("email", "not-an-email")));
            await act(async () => result.current.onSubmit(submitEvent()));
            expect(result.current.errors.email).toBe("Email format is invalid");
        });

        it("does not call fetch when there are validation errors", async () => {
            const { result } = renderHook(() => useProfileView(), { wrapper });
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
            const { result } = renderHook(() => useProfileView(), { wrapper });
            act(() => result.current.onChange(inputEvent("first_name", "Jane")));
            await act(async () => result.current.onSubmit(submitEvent()));
            await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());
            expect(globalThis.fetch).toHaveBeenCalledWith(
                expect.stringContaining(`/user/${mockCurrentUser._id}`),
                expect.objectContaining({ method: "PATCH" }),
            );
        });

        it("calls setUser with the updated user", async () => {
            const { result } = renderHook(() => useProfileView(), { wrapper });
            act(() => result.current.onChange(inputEvent("first_name", "Jane")));
            await act(async () => result.current.onSubmit(submitEvent()));
            await waitFor(() => expect(mockSetUser).toHaveBeenCalled());
            expect(mockSetUser).toHaveBeenCalledWith(
                expect.objectContaining({ first_name: "Jane" }),
            );
        });

        it("fires a success toast", async () => {
            const { result } = renderHook(() => useProfileView(), { wrapper });
            await act(async () => result.current.onSubmit(submitEvent()));
            await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Profile updated"));
        });
    });

    describe("failed update", () => {
        it("shows an error toast with the server message", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: "Something went wrong" }),
            });
            const { result } = renderHook(() => useProfileView(), { wrapper });
            await act(async () => result.current.onSubmit(submitEvent()));
            await waitFor(() =>
                expect(toast.error).toHaveBeenCalledWith("Something went wrong"),
            );
        });

        it("shows a generic error toast when fetch throws", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
                new Error("Network error"),
            );
            const { result } = renderHook(() => useProfileView(), { wrapper });
            await act(async () => result.current.onSubmit(submitEvent()));
            await waitFor(() =>
                expect(toast.error).toHaveBeenCalledWith("Something went wrong"),
            );
        });
    });

    describe("onReset", () => {
        it("restores form to currentUser data and clears errors", async () => {
            const { result } = renderHook(() => useProfileView(), { wrapper });
            act(() => {
                result.current.onChange(inputEvent("first_name", ""));
                result.current.onChange(inputEvent("last_name", ""));
            });
            await act(async () => result.current.onSubmit(submitEvent()));
            expect(result.current.errors.first_name).toBe("First name is required");
            act(() => result.current.onReset());
            expect(result.current.formData.first_name).toBe("Test");
            expect(result.current.errors).toEqual({
                first_name: "",
                last_name: "",
                email: "",
                bio: "",
            });
        });
    });

    describe("onDeleteProfile", () => {
        it("calls the delete endpoint for the current user", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => ({}),
            });
            const { result } = renderHook(() => useProfileView(), { wrapper });
            await act(async () => result.current.onDeleteProfile());
            expect(globalThis.fetch).toHaveBeenCalledWith(
                expect.stringContaining(`/user/${mockCurrentUser._id}`),
                expect.objectContaining({ method: "DELETE" }),
            );
        });

        it("fires a success toast, clears the user, and navigates home", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => ({}),
            });
            const { result } = renderHook(() => useProfileView(), { wrapper });
            await act(async () => result.current.onDeleteProfile());
            expect(toast.success).toHaveBeenCalledWith("Account deleted");
            expect(mockSetUser).toHaveBeenCalledWith(null);
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });

        it("shows an error toast and returns false on failure", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: "This account cannot be deleted" }),
            });
            const { result } = renderHook(() => useProfileView(), { wrapper });
            let success;
            await act(async () => {
                success = await result.current.onDeleteProfile();
            });
            expect(success).toBe(false);
            expect(toast.error).toHaveBeenCalledWith("Unable to delete account, try again.");
            expect(mockSetUser).not.toHaveBeenCalled();
        });

        it("shows an error toast and returns false when fetch throws", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
                new Error("Network error"),
            );
            const { result } = renderHook(() => useProfileView(), { wrapper });
            let success;
            await act(async () => {
                success = await result.current.onDeleteProfile();
            });
            expect(success).toBe(false);
            expect(toast.error).toHaveBeenCalledWith("Unable to delete account, try again.");
        });

        it("returns true on success", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => ({}),
            });
            const { result } = renderHook(() => useProfileView(), { wrapper });
            let success;
            await act(async () => {
                success = await result.current.onDeleteProfile();
            });
            expect(success).toBe(true);
        });
    });
});
