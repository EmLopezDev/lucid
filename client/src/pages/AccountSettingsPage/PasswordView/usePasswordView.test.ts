import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { usePasswordView } from "./usePasswordView.js";
import { toast } from "sonner";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const mockCurrentUser = { _id: "user-1" };

vi.mock("../../../contexts/UserContext/useUserContext", () => ({
    useUserContext: () => ({ currentUser: mockCurrentUser }),
}));

function inputEvent(name: string, value: string) {
    return { target: { name, value } } as React.ChangeEvent<HTMLInputElement>;
}

function submitEvent() {
    return { preventDefault: vi.fn() } as unknown as React.SubmitEvent<HTMLFormElement>;
}

const validForm = {
    current_password: "oldpassword123",
    new_password: "newpassword456",
};

describe("usePasswordView", () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    it("starts with empty form and no errors", () => {
        const { result } = renderHook(() => usePasswordView());
        expect(result.current.formData).toEqual({ current_password: "", new_password: "" });
        expect(result.current.errors).toEqual({ current_password: "", new_password: "" });
        expect(result.current.formError).toBe("");
    });

    describe("validation", () => {
        it("shows required errors when submitting an empty form", async () => {
            const { result } = renderHook(() => usePasswordView());
            await act(async () => result.current.onSubmit(submitEvent()));
            expect(result.current.errors.current_password).toBe("Current password is required");
            expect(result.current.errors.new_password).toBe("New password is required");
        });

        it("shows an error when new password is too short", async () => {
            const { result } = renderHook(() => usePasswordView());
            act(() => {
                result.current.onChange(inputEvent("current_password", "oldpassword123"));
                result.current.onChange(inputEvent("new_password", "short"));
            });
            await act(async () => result.current.onSubmit(submitEvent()));
            expect(result.current.errors.new_password).toBe("Must be at least 8 characters");
        });

        it("does not call fetch when there are validation errors", async () => {
            const { result } = renderHook(() => usePasswordView());
            await act(async () => result.current.onSubmit(submitEvent()));
            expect(globalThis.fetch).not.toHaveBeenCalled();
        });
    });

    describe("successful update", () => {
        beforeEach(() => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: true });
        });

        it("calls the password endpoint with form data", async () => {
            const { result } = renderHook(() => usePasswordView());
            act(() => {
                result.current.onChange(inputEvent("current_password", validForm.current_password));
                result.current.onChange(inputEvent("new_password", validForm.new_password));
            });
            await act(async () => result.current.onSubmit(submitEvent()));
            await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());
            expect(globalThis.fetch).toHaveBeenCalledWith(
                expect.stringContaining(`/user/${mockCurrentUser._id}/password`),
                expect.objectContaining({ method: "PATCH" }),
            );
        });

        it("clears the form and fires a success toast", async () => {
            const { result } = renderHook(() => usePasswordView());
            act(() => {
                result.current.onChange(inputEvent("current_password", validForm.current_password));
                result.current.onChange(inputEvent("new_password", validForm.new_password));
            });
            await act(async () => result.current.onSubmit(submitEvent()));
            await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Password updated"));
            expect(result.current.formData).toEqual({ current_password: "", new_password: "" });
        });
    });

    describe("failed update", () => {
        it("sets formError from the server message", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: "One or more credentials is incorrect" }),
            });
            const { result } = renderHook(() => usePasswordView());
            act(() => {
                result.current.onChange(inputEvent("current_password", validForm.current_password));
                result.current.onChange(inputEvent("new_password", validForm.new_password));
            });
            await act(async () => result.current.onSubmit(submitEvent()));
            await waitFor(() =>
                expect(result.current.formError).toBe("One or more credentials is incorrect"),
            );
        });

        it("sets formError when fetch throws", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error());
            const { result } = renderHook(() => usePasswordView());
            act(() => {
                result.current.onChange(inputEvent("current_password", validForm.current_password));
                result.current.onChange(inputEvent("new_password", validForm.new_password));
            });
            await act(async () => result.current.onSubmit(submitEvent()));
            await waitFor(() => expect(result.current.formError).toBe("Something went wrong"));
        });
    });

    describe("onReset", () => {
        it("clears the form, errors, and success state", async () => {
            const { result } = renderHook(() => usePasswordView());
            await act(async () => result.current.onSubmit(submitEvent()));
            expect(result.current.errors.current_password).toBe("Current password is required");
            act(() => result.current.onReset());
            expect(result.current.formData).toEqual({ current_password: "", new_password: "" });
            expect(result.current.errors).toEqual({ current_password: "", new_password: "" });
            expect(result.current.formError).toBe("");
        });
    });
});
