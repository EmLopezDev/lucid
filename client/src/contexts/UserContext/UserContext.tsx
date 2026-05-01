import { useState, useMemo, useCallback, type ReactNode } from "react";
import { UserContext } from "./useUserContext";
import { type UserType } from "../../../../packages/types";

// TODO: Remove demoUser and set user state to null, this is just to avoid having to signin all the time
const demoUser: UserType = {
    _id: "1",
    first_name: "Emmanuel",
    last_name: "Lopez",
    email: "elopez1@gmail.com",
    created_at: new Date("2024-01-01"),
    updated_at: null,
    deleted_at: null,
};

export interface UserContextType {
    currentUser: UserType | null;
    setUser: (user: UserType | null) => void;
    isUserAuthenticated: boolean;
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<UserType | null>(demoUser);

    const setUser = useCallback((user: UserType | null) => {
        setCurrentUser(user);
    }, []);

    const contextValue = useMemo(
        () => ({
            currentUser,
            setUser,
            isUserAuthenticated: !!currentUser,
        }),
        [currentUser, setUser],
    );

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
