import { useMemo, type ReactNode } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@config/api";
import { VerifyEmailPageContext } from "./useVerifyEmailPageContext";

export type VerifyStatus = "loading" | "success" | "error" | "no_token";

export type VerifyEmailPageContextType = {
    status: VerifyStatus;
    errorMessage: string | null;
};

const verifyEmail = async (token: string) => {
    const res = await fetch(`${API_URL}/auth/verify-email?token=${encodeURIComponent(token)}`);
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message ?? "Verification failed");
    }
    return true;
};

const getVerifyStatus = (
    token: string | null,
    isLoading: boolean,
    isError: boolean,
): VerifyStatus => {
    if (!token) return "no_token";
    if (isLoading) return "loading";
    if (isError) return "error";
    return "success";
};

export const VerifyEmailPageProvider = ({ children }: { children: ReactNode }) => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const { isLoading, isError, error } = useQuery({
        queryKey: ["verify-email", token],
        queryFn: () => verifyEmail(token!),
        enabled: !!token,
        retry: false,
    });

    const status = getVerifyStatus(token, isLoading, isError);

    const contextValue = useMemo(
        () => ({ status, errorMessage: error instanceof Error ? error.message : null }),
        [status, error],
    );

    return (
        <VerifyEmailPageContext.Provider value={contextValue}>
            {children}
        </VerifyEmailPageContext.Provider>
    );
};
