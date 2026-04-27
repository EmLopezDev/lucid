import { createContext, useContext } from "react";
import { type UserLibraryPageContextType } from "./UserLibraryPageContext";

export const UserLibraryPageContext = createContext<UserLibraryPageContextType | null>(null);

export const useUserLibraryPageContext = () => {
    const context = useContext(UserLibraryPageContext);
    if (!context) {
        throw new Error("useUserLibraryPageContext must be used within an Provider");
    }
    return context;
};
