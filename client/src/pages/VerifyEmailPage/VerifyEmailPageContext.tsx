import { useState, useEffect, useRef, useMemo, type ReactNode } from "react";
import { useSearchParams } from "react-router";
import { API_URL } from "../../config/api";
import { VerifyEmailPageContext } from "./useVerifyEmailPageContext";

export type VerifyStatus = "loading" | "success" | "error" | "no_token";

export interface VerifyEmailPageContextType {
    status: VerifyStatus;
}

export const VerifyEmailPageProvider = ({ children }: { children: ReactNode }) => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<VerifyStatus>(token ? "loading" : "no_token");
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!token || hasFetched.current) return;
        hasFetched.current = true;

        fetch(`${API_URL}/auth/verify-email?token=${encodeURIComponent(token)}`)
            .then((res) => {
                setStatus(res.ok ? "success" : "error");
            })
            .catch(() => {
                setStatus("error");
            });
    }, [token]);

    const contextValue = useMemo(() => ({ status }), [status]);

    return (
        <VerifyEmailPageContext.Provider value={contextValue}>
            {children}
        </VerifyEmailPageContext.Provider>
    );
};
