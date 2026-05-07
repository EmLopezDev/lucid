import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { RegisterPageProvider } from "./RegisterPageContext";
import { useRegisterPageContext } from "./useRegisterPageContext";

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("react-router", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react-router")>();
    return { ...actual, useNavigate: () => mockNavigate };
});

const wrapper = ({ children }: { children: ReactNode }) => (
    <RegisterPageProvider>{children}</RegisterPageProvider>
);

function inputEvent(value: string) {
    return { target: { value } } as React.ChangeEvent<HTMLInputElement>;
}

function submitEvent() {
    return { preventDefault: vi.fn() } as unknown as React.SubmitEvent<HTMLFormElement>;
}

const validForm = {
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    password: "password123",
};

describe("RegisterPageContext", () => {
    beforeEach(() => {
        mockNavigate.mockReset();
        globalThis.fetch = vi.fn();
    });

    it("starts with empty errors and not submitting", () => {
        const { result } = renderHook(() => useRegisterPageContext(), { wrapper });
        expect(result.current.errors).toEqual({
            first_name: "",
            last_name: "",
            email: "",
            password: "",
        });
        expect(result.current.isSubmitting).toBe(false);
        expect(result.current.formDataError).toBe("");
    });

    describe("validation", () => {
        it("shows required errors when submitting an empty form", () => {
            const { result } = renderHook(() => useRegisterPageContext(), { wrapper });
            act(() => result.current.onSubmitForm(submitEvent()));
            expect(result.current.errors.first_name).toBe("First name is required");
            expect(result.current.errors.last_name).toBe("Last name is required");
            expect(result.current.errors.email).toBe("Email is required");
            expect(result.current.errors.password).toBe("Password is required");
        });

        it("shows a name format error for a non-letter first name", () => {
            const { result } = renderHook(() => useRegisterPageContext(), { wrapper });
            act(() => {
                result.current.onFirstNameChange(inputEvent("John123"));
                result.current.onLastNameChange(inputEvent("Doe"));
                result.current.onEmailChange(inputEvent("john@example.com"));
                result.current.onPasswordChange(inputEvent("password123"));
            });
            act(() => result.current.onSubmitForm(submitEvent()));
            expect(result.current.errors.first_name).toBe("First name should only be letters");
        });

        it("shows an email format error for an invalid email", () => {
            const { result } = renderHook(() => useRegisterPageContext(), { wrapper });
            act(() => {
                result.current.onFirstNameChange(inputEvent("John"));
                result.current.onLastNameChange(inputEvent("Doe"));
                result.current.onEmailChange(inputEvent("not-an-email"));
                result.current.onPasswordChange(inputEvent("password123"));
            });
            act(() => result.current.onSubmitForm(submitEvent()));
            expect(result.current.errors.email).toBe("Email format is invalid");
        });

        it("shows a password length error when password is too short", () => {
            const { result } = renderHook(() => useRegisterPageContext(), { wrapper });
            act(() => {
                result.current.onFirstNameChange(inputEvent("John"));
                result.current.onLastNameChange(inputEvent("Doe"));
                result.current.onEmailChange(inputEvent("john@example.com"));
                result.current.onPasswordChange(inputEvent("short"));
            });
            act(() => result.current.onSubmitForm(submitEvent()));
            expect(result.current.errors.password).toBe("Password must be at least 8 characters");
        });

        it("does not call fetch when there are validation errors", () => {
            const { result } = renderHook(() => useRegisterPageContext(), { wrapper });
            act(() => result.current.onSubmitForm(submitEvent()));
            expect(globalThis.fetch).not.toHaveBeenCalled();
        });
    });

    describe("successful registration", () => {
        beforeEach(() => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ _id: "1" }),
            });
        });

        it("calls the register endpoint with form data", async () => {
            const { result } = renderHook(() => useRegisterPageContext(), { wrapper });
            act(() => {
                result.current.onFirstNameChange(inputEvent(validForm.first_name));
                result.current.onLastNameChange(inputEvent(validForm.last_name));
                result.current.onEmailChange(inputEvent(validForm.email));
                result.current.onPasswordChange(inputEvent(validForm.password));
            });
            act(() => result.current.onSubmitForm(submitEvent()));
            await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());
            expect(globalThis.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/auth/register"),
                expect.objectContaining({ method: "POST" }),
            );
        });

        it("navigates to /signin after success", async () => {
            const { result } = renderHook(() => useRegisterPageContext(), { wrapper });
            act(() => {
                result.current.onFirstNameChange(inputEvent(validForm.first_name));
                result.current.onLastNameChange(inputEvent(validForm.last_name));
                result.current.onEmailChange(inputEvent(validForm.email));
                result.current.onPasswordChange(inputEvent(validForm.password));
            });
            act(() => result.current.onSubmitForm(submitEvent()));
            await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
            expect(mockNavigate).toHaveBeenCalledWith("/signin");
        });
    });

    describe("failed registration", () => {
        it("sets formDataError from the server error message", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: "Email already in use" }),
            });
            const { result } = renderHook(() => useRegisterPageContext(), { wrapper });
            act(() => {
                result.current.onFirstNameChange(inputEvent(validForm.first_name));
                result.current.onLastNameChange(inputEvent(validForm.last_name));
                result.current.onEmailChange(inputEvent(validForm.email));
                result.current.onPasswordChange(inputEvent(validForm.password));
            });
            act(() => result.current.onSubmitForm(submitEvent()));
            await waitFor(() => expect(result.current.formDataError).toBe("Email already in use"));
        });

        it("sets formDataError when fetch throws", async () => {
            (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
                new Error("Network error"),
            );
            const { result } = renderHook(() => useRegisterPageContext(), { wrapper });
            act(() => {
                result.current.onFirstNameChange(inputEvent(validForm.first_name));
                result.current.onLastNameChange(inputEvent(validForm.last_name));
                result.current.onEmailChange(inputEvent(validForm.email));
                result.current.onPasswordChange(inputEvent(validForm.password));
            });
            act(() => result.current.onSubmitForm(submitEvent()));
            await waitFor(() => expect(result.current.formDataError).toBe("Network error"));
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
            const { result } = renderHook(() => useRegisterPageContext(), { wrapper });
            act(() => {
                result.current.onFirstNameChange(inputEvent(validForm.first_name));
                result.current.onLastNameChange(inputEvent(validForm.last_name));
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
        it("clears errors and formDataError", () => {
            const { result } = renderHook(() => useRegisterPageContext(), { wrapper });
            act(() => result.current.onSubmitForm(submitEvent()));
            expect(result.current.errors.first_name).toBe("First name is required");
            act(() => result.current.onResetForm());
            expect(result.current.errors).toEqual({
                first_name: "",
                last_name: "",
                email: "",
                password: "",
            });
            expect(result.current.formDataError).toBe("");
        });
    });
});
