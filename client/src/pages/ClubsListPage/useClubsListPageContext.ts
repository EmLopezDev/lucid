import { createContext, useContext } from "react";
import { type ClubsListPageContextType } from "./ClubsListPageContext";

export const ClubsListPageContext = createContext<ClubsListPageContextType | null>(null);

export const useClubsListPageContext = () => {
    const context = useContext(ClubsListPageContext);
    if (!context) {
        throw new Error("useClubsListPageContext must be used within an Provider");
    }
    return context;
};
