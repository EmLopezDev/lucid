import { createContext, useContext } from "react";
import { type ClubPageContextType } from "../ClubPageContext";

export const ClubPageContext = createContext<ClubPageContextType | null>(null);

export const useClubPageContext = () => {
    const context = useContext(ClubPageContext);
    if (!context) {
        throw new Error("useClubPageContext must be used within an Provider");
    }
    return context;
};
