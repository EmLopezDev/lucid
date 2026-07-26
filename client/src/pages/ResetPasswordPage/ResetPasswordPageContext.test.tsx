import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { ResetPasswordPageProvider } from "./ResetPasswordPageContext";
import { useResetPasswordPageContext } from "./useResetPasswordContext";
import { createQueryWrapper } from "../../tests/createQueryWrapper";

const TEST_TOKEN = "test-reset-token";

const ProviderWithToken = ({ children }: { children: ReactNode }) => (
    <ResetPasswordPageProvider token={TEST_TOKEN}>{children}</ResetPasswordPageProvider>
);

const wrapper = createQueryWrapper(ProviderWithToken);

function inputEvent(value: string) {
    return { target: { value } } as React.ChangeEvent<HTMLInputElement>;
}

function submitEvent() {
    return { preventDefault: vi.fn() } as unknown as React.SubmitEvent<HTMLFormElement>;
}

describe("ResetPasswordPageContext", () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    it("starts with empty errors and not submitting", () => {
        const { result } = renderHook(() => useResetPasswordPageContext(), { wrapper });
        expect(result.current.errors).toEqual({ hash: "", new_password: "" });
        expect(result.current.isSubmitting).toBe(false);
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.formDataError).toBe("");
    });

    describe("validation", () => {
        it("shows a required error when submitting an empty form", async () => {
            const { result } = renderHook(() => useResetPasswordPageContext(), { wrapper });
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(result.current.errors.new_password).toBe("Password is required");
        });

        it("shows a length error when password is too short", async () => {
            const { result } = renderHook(() => useResetPasswordPageContext(), { wrapper });
            act(() => result.current.onPasswordChange(inputEvent("short")));
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(result.current.errors.new_password).toBe(
                "Password must be at least 8 characters",
            );
        });

        it("does not call fetch when there are validation errors", async () => {
            const { result } = renderHook(() => useResetPasswordPageContext(), { wrapper });
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(globalThis.fetch).not.toHaveBeenCalled();
        });
    });

    describe("successful submission", () => {
        beforeEach(() => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: true });
        });

        it("calls the reset-password endpoint with the token and new password", async () => {
            const { result } = renderHook(() => useResetPasswordPageContext(), { wrapper });
            act(() => result.current.onPasswordChange(inputEvent("newpassword123")));
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(globalThis.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/auth/reset-password"),
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify({ hash: TEST_TOKEN, new_password: "newpassword123" }),
                }),
            );
        });

        it("sets isSuccess to true", async () => {
            const { result } = renderHook(() => useResetPasswordPageContext(), { wrapper });
            act(() => result.current.onPasswordChange(inputEvent("newpassword123")));
            await act(async () => result.current.onSubmitForm(submitEvent()));
            await waitFor(() => expect(result.current.isSuccess).toBe(true));
        });
    });

    describe("failed submission", () => {
        it("sets formDataError from the server error message", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: "Invalid or expired token" }),
            });
            const { result } = renderHook(() => useResetPasswordPageContext(), { wrapper });
            act(() => result.current.onPasswordChange(inputEvent("newpassword123")));
            await act(async () => result.current.onSubmitForm(submitEvent()));
            await waitFor(() =>
                expect(result.current.formDataError).toBe("Invalid or expired token"),
            );
        });

        it("sets formDataError when fetch throws", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
                new Error("Network error"),
            );
            const { result } = renderHook(() => useResetPasswordPageContext(), { wrapper });
            act(() => result.current.onPasswordChange(inputEvent("newpassword123")));
            await act(async () => result.current.onSubmitForm(submitEvent()));
            await waitFor(() =>
                expect(result.current.formDataError).toBe("Something went wrong, try again"),
            );
        });
    });

    describe("isSubmitting", () => {
        it("is true while the request is in flight and false after", async () => {
            let settle!: (v: unknown) => void;
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(
                new Promise((r) => {
                    settle = r;
                }),
            );
            const { result } = renderHook(() => useResetPasswordPageContext(), { wrapper });
            act(() => result.current.onPasswordChange(inputEvent("newpassword123")));
            act(() => {
                result.current.onSubmitForm(submitEvent());
            });
            await waitFor(() => expect(result.current.isSubmitting).toBe(true));
            await act(async () => {
                settle({ ok: false, json: async () => ({ message: "err" }) });
            });
            await waitFor(() => expect(result.current.isSubmitting).toBe(false));
        });
    });

    describe("onResetForm", () => {
        it("clears errors and formDataError", async () => {
            const { result } = renderHook(() => useResetPasswordPageContext(), { wrapper });
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(result.current.errors.new_password).toBe("Password is required");
            act(() => result.current.onResetForm());
            expect(result.current.errors).toEqual({ hash: "", new_password: "" });
            expect(result.current.formDataError).toBe("");
        });
    });
});
