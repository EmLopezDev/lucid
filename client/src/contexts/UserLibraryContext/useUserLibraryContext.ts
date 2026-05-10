import { createContext, useContext } from "react";
import { type UserLibraryContextType } from "./UserLibraryContext";

export const UserLibraryContext = createContext<UserLibraryContextType | null>(null);

export const useUserLibraryContext = () => {
    const context = useContext(UserLibraryContext);
    if (!context) {
        throw new Error("useUserLibraryContext must be used within a provider");
    }
    return context;
};
