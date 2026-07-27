import { apiFetch } from "./apiFetch";
export const resendVerificationEmail = (email: string) => {
    return apiFetch(
        "/auth/resend-verification",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        },
        "Something went wrong. Please try again.",
    );
};
