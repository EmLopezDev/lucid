import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { ForgotPasswordPageProvider } from "./ForgotPasswordPageContext";
import { useForgotPasswordPageContext } from "./useForgotPasswordPageContext";

const wrapper = ({ children }: { children: ReactNode }) => (
    <ForgotPasswordPageProvider>{children}</ForgotPasswordPageProvider>
);

function inputEvent(value: string) {
    return { target: { value } } as React.ChangeEvent<HTMLInputElement>;
}

function submitEvent() {
    return { preventDefault: vi.fn() } as unknown as React.SubmitEvent<HTMLFormElement>;
}

describe("ForgotPasswordPageContext", () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    it("starts with empty errors and not submitting", () => {
        const { result } = renderHook(() => useForgotPasswordPageContext(), { wrapper });
        expect(result.current.errors).toEqual({ email: "" });
        expect(result.current.isSubmitting).toBe(false);
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.formDataError).toBe("");
    });

    describe("validation", () => {
        it("shows a required error when submitting an empty form", async () => {
            const { result } = renderHook(() => useForgotPasswordPageContext(), { wrapper });
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(result.current.errors.email).toBe("Email is required");
        });

        it("shows an email format error for an invalid email", async () => {
            const { result } = renderHook(() => useForgotPasswordPageContext(), { wrapper });
            act(() => result.current.onEmailChange(inputEvent("not-an-email")));
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(result.current.errors.email).toBe("Email format is invalid");
        });

        it("does not call fetch when there are validation errors", async () => {
            const { result } = renderHook(() => useForgotPasswordPageContext(), { wrapper });
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(globalThis.fetch).not.toHaveBeenCalled();
        });
    });

    describe("successful submission", () => {
        beforeEach(() => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: true });
        });

        it("calls the forgot-password endpoint with the email", async () => {
            const { result } = renderHook(() => useForgotPasswordPageContext(), { wrapper });
            act(() => result.current.onEmailChange(inputEvent("test@example.com")));
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(globalThis.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/auth/forgot-password"),
                expect.objectContaining({ method: "POST" }),
            );
        });

        it("sets isSuccess to true", async () => {
            const { result } = renderHook(() => useForgotPasswordPageContext(), { wrapper });
            act(() => result.current.onEmailChange(inputEvent("test@example.com")));
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(result.current.isSuccess).toBe(true);
        });
    });

    describe("failed submission", () => {
        it("sets formDataError from the server error message", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: "Something went wrong" }),
            });
            const { result } = renderHook(() => useForgotPasswordPageContext(), { wrapper });
            act(() => result.current.onEmailChange(inputEvent("test@example.com")));
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(result.current.formDataError).toBe("Something went wrong");
        });

        it("sets formDataError when fetch throws", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
                new Error("Network error"),
            );
            const { result } = renderHook(() => useForgotPasswordPageContext(), { wrapper });
            act(() => result.current.onEmailChange(inputEvent("test@example.com")));
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(result.current.formDataError).toBe("Network error");
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
            const { result } = renderHook(() => useForgotPasswordPageContext(), { wrapper });
            act(() => result.current.onEmailChange(inputEvent("test@example.com")));
            act(() => { result.current.onSubmitForm(submitEvent()); });
            await waitFor(() => expect(result.current.isSubmitting).toBe(true));
            await act(async () => {
                settle({ ok: false, json: async () => ({ message: "err" }) });
            });
            expect(result.current.isSubmitting).toBe(false);
        });
    });

    describe("onResetForm", () => {
        it("clears errors and formDataError", async () => {
            const { result } = renderHook(() => useForgotPasswordPageContext(), { wrapper });
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(result.current.errors.email).toBe("Email is required");
            act(() => result.current.onResetForm());
            expect(result.current.errors).toEqual({ email: "" });
            expect(result.current.formDataError).toBe("");
        });
    });
});
