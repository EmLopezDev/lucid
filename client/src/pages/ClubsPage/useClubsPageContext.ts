import { createContext, useContext } from "react";
import { type ClubsPageContextType } from "./ClubsPageContext";

export const ClubsPageContext = createContext<ClubsPageContextType | null>(null);

export const useClubsPageContext = () => {
    const context = useContext(ClubsPageContext);
    if (!context) {
        throw new Error("useClubsPageContext must be used within an Provider");
    }
    return context;
};
