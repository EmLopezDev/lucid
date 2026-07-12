import { useMemo, useCallback, type ReactNode } from "react";
import { UserContext } from "./useUserContext";
import { type UserType } from "@lucid/types";
import { API_URL } from "@config/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface UserContextType {
    currentUser: UserType | null;
    isSessionLoading: boolean;
    isUserAuthenticated: boolean;
    setUser: (user: UserType | null) => void;
    signOut: () => Promise<void>;
}

const checkSession = async ({ signal }: { signal: AbortSignal }) => {
    const res = await fetch(`${API_URL}/auth/session`, {
        credentials: "include",
        signal: AbortSignal.any([signal, AbortSignal.timeout(5000)]),
    });
    if (!res.ok) return null;
    return (await res.json()) as UserType;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient();

    const { data: currentUser = null, isLoading } = useQuery({
        queryKey: ["session"],
        queryFn: checkSession,
        retry: false,
    });

    const setUser = useCallback(
        (user: UserType | null) => {
            queryClient.setQueryData(["session"], user);
        },
        [queryClient],
    );

    const signOutMutation = useMutation({
        mutationFn: async () => {
            await fetch(`${API_URL}/auth/signout`, { method: "POST", credentials: "include" });
        },
        meta: { successMessage: "Signed out. Your save file is safe." },
        onSuccess: () => {
            queryClient.setQueryData(["session"], null);
        },
    });

    const signOut = useCallback(async () => {
        await signOutMutation.mutateAsync();
    }, [signOutMutation]);

    const contextValue = useMemo(
        () => ({
            currentUser,
            isSessionLoading: isLoading,
            isUserAuthenticated: !!currentUser,
            setUser,
            signOut,
        }),
        [currentUser, isLoading, setUser, signOut],
    );

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
