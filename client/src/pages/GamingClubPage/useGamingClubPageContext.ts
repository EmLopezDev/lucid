import { createContext, useContext } from "react";
import { type GamingClubPageContextType } from "./GamingClubPageContext";

export const GamingClubPageContext = createContext<GamingClubPageContextType | null>(null);

export const useGamingClubPageContext = () => {
    const context = useContext(GamingClubPageContext);
    if (!context) {
        throw new Error("useGamingClubPageContext must be used within an Provider");
    }
    return context;
};
