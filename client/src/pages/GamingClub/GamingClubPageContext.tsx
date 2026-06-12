import { useMemo, useState, useEffect, useCallback, type ReactNode, type ChangeEvent } from "react";
import { type GamingClubType } from "@lucid/types";
import { GamingClubPageContext } from "./useGamingClubPageContext";
import { API_URL } from "@config/api";

export type GamingClubPageContextType = {
    isLoading: boolean;
    error: string | null;
    filteredClubData: GamingClubType[];
    handleOnSearchClub: (event: ChangeEvent<HTMLInputElement>) => void;
    refetch: () => void;
};

export const GamingClubPageProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clubData, setClubData] = useState<GamingClubType[]>([]);
    const [filterData, setFilterData] = useState({ searchName: "" });
    const [fetchTrigger, setFetchTrigger] = useState(0);

    const filteredClubData = useMemo(() => {
        if (!filterData.searchName) return clubData;
        return clubData.filter((club) => {
            return club.name.toLowerCase().includes(filterData.searchName.toLowerCase());
        });
    }, [clubData, filterData]);

    const handleOnSearchClub = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setFilterData((prevState) => ({ ...prevState, searchName: event.target.value }));
    }, []);

    const refetch = useCallback(() => setFetchTrigger((n) => n + 1), []);

    useEffect(() => {
        const fetchGamingClubData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/clubs`, { credentials: "include" });
                if (!response.ok) throw new Error("Failed to fetch clubs");
                const data = await response.json();
                setClubData(data);
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error(error instanceof Error ? error.message : error);
                }
                setError(error instanceof Error ? error.message : "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        };
        fetchGamingClubData();
    }, [fetchTrigger]);

    const contextValue = useMemo(
        () => ({
            isLoading,
            error,
            filteredClubData,
            handleOnSearchClub,
            refetch,
        }),
        [isLoading, error, filteredClubData, handleOnSearchClub, refetch],
    );

    return (
        <GamingClubPageContext.Provider value={contextValue}>
            {children}
        </GamingClubPageContext.Provider>
    );
};
