import { createContext, useContext } from "react";
import type { UserType } from "../../../../packages/types";

interface UserContextType {
    userState: UserType | null;
    setUser: (user: UserType | null) => void;
    isUserAuthenticated: boolean;
}

export const UserContext = createContext<UserContextType | null>(null);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within an AppProvider");
    }
    return context;
};
