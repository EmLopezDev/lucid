import { useMemo, useState, useEffect, type ReactNode } from "react";
import { type GamingClubType } from "@lucid/types";
import { GamingClubPageContext } from "./useGamingClubPageContext";
import { API_URL } from "@config/api";

export type GamingClubPageContextType = {
    isLoading: boolean;
    clubData: GamingClubType[];
};

export const GamingClubPageProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [clubData, setClubData] = useState<GamingClubType[]>([]);

    const contextValue = useMemo(
        () => ({
            isLoading,
            clubData,
        }),
        [isLoading, clubData],
    );

    useEffect(() => {
        const fetchGamingClubData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/clubs`, { credentials: "include" });
                const data = await response.json();
                setClubData(data);
            } catch (error) {
                if (import.meta.env.DEV)
                    console.error(error instanceof Error ? error.message : error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGamingClubData();
    }, []);

    return (
        <GamingClubPageContext.Provider value={contextValue}>
            {children}
        </GamingClubPageContext.Provider>
    );
};
