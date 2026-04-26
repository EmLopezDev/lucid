import { useState, useMemo, useCallback, type ReactNode } from "react";
import { UserContext } from "./useUserContext";
import { type UserType } from "../../../../packages/types";

// TODO: Remove demoUser and set user state to null, this is just to avoid having to signin all the time
const demoUser: UserType = {
    _id: "12345",
    first_name: "Emmanuel",
    last_name: "Lopez",
    email: "elopez1@gmail.com",
    created_at: new Date("2024-01-01"),
    updated_at: null,
    deleted_at: null,
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userState, setUserState] = useState<UserType | null>(demoUser);

    const setUser = useCallback((user: UserType | null) => {
        setUserState(user);
    }, []);

    const contextValue = useMemo(
        () => ({
            userState,
            setUser,
            isUserAuthenticated: !!userState,
        }),
        [userState, setUser],
    );

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
