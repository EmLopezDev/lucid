import { createContext, useContext } from "react";
import { type UserContextType } from "./UserContext";

export const UserContext = createContext<UserContextType | null>(null);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within an AppProvider");
    }
    return context;
};
