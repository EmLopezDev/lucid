import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { SignInPageProvider } from "./SignInPageContext";
import { useSignInPageContext } from "./useSignInPageContext";

const mockNavigate = vi.hoisted(() => vi.fn());
const mockSetUser = vi.hoisted(() => vi.fn());

vi.mock("react-router", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react-router")>();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useSearchParams: () => [new URLSearchParams(), vi.fn()],
    };
});

vi.mock("../../contexts/UserContext/useUserContext", () => ({
    useUserContext: () => ({ setUser: mockSetUser }),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
    <SignInPageProvider>{children}</SignInPageProvider>
);

function inputEvent(value: string) {
    return { target: { value } } as React.ChangeEvent<HTMLInputElement>;
}

function submitEvent() {
    return { preventDefault: vi.fn() } as unknown as React.SubmitEvent<HTMLFormElement>;
}

const validForm = { email: "john@example.com", password: "password123" };

describe("SignInPageContext", () => {
    beforeEach(() => {
        mockNavigate.mockReset();
        mockSetUser.mockReset();
        globalThis.fetch = vi.fn();
    });

    it("starts with empty errors and not submitting", () => {
        const { result } = renderHook(() => useSignInPageContext(), { wrapper });
        expect(result.current.errors).toEqual({ email: "", password: "" });
        expect(result.current.isSubmitting).toBe(false);
        expect(result.current.formDataError).toBe("");
    });

    it("pre-fills form when initialValues are provided", () => {
        const initialValues = { email: "demo@lucid.com", password: "lucid-demo" };
        const { result } = renderHook(() => useSignInPageContext(), {
            wrapper: ({ children }: { children: ReactNode }) => (
                <SignInPageProvider initialValues={initialValues}>{children}</SignInPageProvider>
            ),
        });
        expect(result.current.email).toBe("demo@lucid.com");
        expect(result.current.password).toBe("lucid-demo");
    });

    describe("validation", () => {
        it("shows required errors when submitting an empty form", async () => {
            const { result } = renderHook(() => useSignInPageContext(), { wrapper });
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(result.current.errors.email).toBe("Email is required");
            expect(result.current.errors.password).toBe("Password is required");
        });

        it("shows an email format error for an invalid email", async () => {
            const { result } = renderHook(() => useSignInPageContext(), { wrapper });
            act(() => {
                result.current.onEmailChange(inputEvent("not-an-email"));
                result.current.onPasswordChange(inputEvent("password123"));
            });
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(result.current.errors.email).toBe("Email format is invalid");
        });

        it("shows a password length error when password is too short", async () => {
            const { result } = renderHook(() => useSignInPageContext(), { wrapper });
            act(() => {
                result.current.onEmailChange(inputEvent("john@example.com"));
                result.current.onPasswordChange(inputEvent("short"));
            });
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(result.current.errors.password).toBe("Password must be at least 8 characters");
        });

        it("does not call fetch when there are validation errors", async () => {
            const { result } = renderHook(() => useSignInPageContext(), { wrapper });
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(globalThis.fetch).not.toHaveBeenCalled();
        });
    });

    describe("successful sign-in", () => {
        const user = { _id: "1", first_name: "John" };

        beforeEach(() => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => user,
            });
        });

        it("calls setUser with the returned user data", async () => {
            const { result } = renderHook(() => useSignInPageContext(), { wrapper });
            act(() => {
                result.current.onEmailChange(inputEvent(validForm.email));
                result.current.onPasswordChange(inputEvent(validForm.password));
            });
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(mockSetUser).toHaveBeenCalledWith(user);
        });

        it("navigates to / after success", async () => {
            const { result } = renderHook(() => useSignInPageContext(), { wrapper });
            act(() => {
                result.current.onEmailChange(inputEvent(validForm.email));
                result.current.onPasswordChange(inputEvent(validForm.password));
            });
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    describe("failed sign-in", () => {
        it("sets formDataError from the server error message", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: "Invalid credentials" }),
            });
            const { result } = renderHook(() => useSignInPageContext(), { wrapper });
            act(() => {
                result.current.onEmailChange(inputEvent(validForm.email));
                result.current.onPasswordChange(inputEvent(validForm.password));
            });
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(result.current.formDataError).toBe("Invalid credentials");
        });

        it("sets formDataError when fetch throws", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
                new Error("Network error"),
            );
            const { result } = renderHook(() => useSignInPageContext(), { wrapper });
            act(() => {
                result.current.onEmailChange(inputEvent(validForm.email));
                result.current.onPasswordChange(inputEvent(validForm.password));
            });
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
            const { result } = renderHook(() => useSignInPageContext(), { wrapper });
            act(() => {
                result.current.onEmailChange(inputEvent(validForm.email));
                result.current.onPasswordChange(inputEvent(validForm.password));
            });
            act(() => {
                result.current.onSubmitForm(submitEvent());
            });
            await waitFor(() => expect(result.current.isSubmitting).toBe(true));
            await act(async () => {
                settle({ ok: false, json: async () => ({ message: "err" }) });
            });
            expect(result.current.isSubmitting).toBe(false);
        });
    });

    describe("onResetForm", () => {
        it("clears errors and formDataError", async () => {
            const { result } = renderHook(() => useSignInPageContext(), { wrapper });
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(result.current.errors.email).toBe("Email is required");
            act(() => result.current.onResetForm());
            expect(result.current.errors).toEqual({ email: "", password: "" });
            expect(result.current.formDataError).toBe("");
        });
    });

    describe("unverified email", () => {
        it("starts with unverified and resendSuccess as false", () => {
            const { result } = renderHook(() => useSignInPageContext(), { wrapper });
            expect(result.current.unverified).toBe(false);
            expect(result.current.resendSuccess).toBe(false);
        });

        it("sets unverified to true when sign-in returns 403", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                status: 403,
                json: async () => ({ message: "Please verify your email before signing in" }),
            });
            const { result } = renderHook(() => useSignInPageContext(), { wrapper });
            act(() => {
                result.current.onEmailChange(inputEvent(validForm.email));
                result.current.onPasswordChange(inputEvent(validForm.password));
            });
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(result.current.unverified).toBe(true);
        });

        it("does not set unverified on a 401", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                status: 401,
                json: async () => ({ message: "One or more credentials is incorrect" }),
            });
            const { result } = renderHook(() => useSignInPageContext(), { wrapper });
            act(() => {
                result.current.onEmailChange(inputEvent(validForm.email));
                result.current.onPasswordChange(inputEvent(validForm.password));
            });
            await act(async () => result.current.onSubmitForm(submitEvent()));
            expect(result.current.unverified).toBe(false);
        });

        describe("onResendVerification", () => {
            it("calls the resend endpoint with the form email", async () => {
                (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: true });
                const { result } = renderHook(() => useSignInPageContext(), { wrapper });
                act(() => result.current.onEmailChange(inputEvent(validForm.email)));
                await act(async () => result.current.onResendVerification());
                expect(globalThis.fetch).toHaveBeenCalledWith(
                    expect.stringContaining("/auth/resend-verification"),
                    expect.objectContaining({
                        method: "POST",
                        body: JSON.stringify({ email: validForm.email }),
                    }),
                );
            });

            it("sets resendSuccess to true on success", async () => {
                (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: true });
                const { result } = renderHook(() => useSignInPageContext(), { wrapper });
                await act(async () => result.current.onResendVerification());
                expect(result.current.resendSuccess).toBe(true);
            });

            it("sets formDataError when the server responds with an error", async () => {
                (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                    ok: false,
                    json: async () => ({ message: "Too many requests" }),
                });
                const { result } = renderHook(() => useSignInPageContext(), { wrapper });
                await act(async () => result.current.onResendVerification());
                expect(result.current.formDataError).toBe("Too many requests");
            });

            it("sets formDataError when fetch throws", async () => {
                (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error());
                const { result } = renderHook(() => useSignInPageContext(), { wrapper });
                await act(async () => result.current.onResendVerification());
                expect(result.current.formDataError).toBe("Something went wrong. Please try again.");
            });
        });

        it("onResetForm clears unverified and resendSuccess", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>)
                .mockResolvedValueOnce({
                    ok: false,
                    status: 403,
                    json: async () => ({ message: "Please verify your email before signing in" }),
                })
                .mockResolvedValueOnce({ ok: true });
            const { result } = renderHook(() => useSignInPageContext(), { wrapper });
            act(() => {
                result.current.onEmailChange(inputEvent(validForm.email));
                result.current.onPasswordChange(inputEvent(validForm.password));
            });
            await act(async () => result.current.onSubmitForm(submitEvent()));
            await act(async () => result.current.onResendVerification());
            expect(result.current.unverified).toBe(true);
            expect(result.current.resendSuccess).toBe(true);
            act(() => result.current.onResetForm());
            expect(result.current.unverified).toBe(false);
            expect(result.current.resendSuccess).toBe(false);
        });
    });
});
