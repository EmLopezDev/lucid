import { useState, useMemo, useCallback, useEffect, type ReactNode } from "react";
import { UserContext } from "./useUserContext";
import { type UserType } from "../../../../packages/types";
import { API_URL } from "../../config/api";

export interface UserContextType {
    currentUser: UserType | null;
    isSessionLoading: boolean;
    setUser: (user: UserType | null) => void;
    signOut: () => Promise<void>;
    isUserAuthenticated: boolean;
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const [isSessionLoading, setIsSessionLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch(`${API_URL}/auth/session`, { credentials: "include" });
                const user: UserType | null = res.ok ? await res.json() : null;
                setCurrentUser(user);
            } catch {
                setCurrentUser(null);
            } finally {
                setIsSessionLoading(false);
            }
        };
        checkSession();
    }, []);

    const setUser = useCallback((user: UserType | null) => {
        setCurrentUser(user);
    }, []);

    const signOut = useCallback(async () => {
        await fetch(`${API_URL}/auth/signout`, { method: "POST", credentials: "include" });
        setCurrentUser(null);
    }, []);

    const contextValue = useMemo(
        () => ({
            currentUser,
            isSessionLoading,
            setUser,
            signOut,
            isUserAuthenticated: !!currentUser,
        }),
        [currentUser, isSessionLoading, setUser, signOut],
    );

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
