import { useState, useEffect, useMemo, type ReactNode } from "react";
import { type ClubDetailType } from "@lucid/types";
import { API_URL } from "@config/api";
import { ClubPageContext } from "./useClubPageContext";
import { useUserContext } from "@contexts/UserContext/useUserContext";

export type ClubPageContextType = {
    isLoading: boolean;
    error: string | null;
    clubData: ClubDetailType | null;
    isOwner: boolean;
    isMember: boolean;
};

export const ClubPageProvider = ({ children, clubId }: { children: ReactNode; clubId: string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clubData, setClubData] = useState<ClubDetailType | null>(null);

    const { currentUser } = useUserContext();

    const isOwner = currentUser?._id === clubData?.owner;
    const isMember = clubData?.members.some((m) => m._id === (currentUser?._id ?? "")) ?? false;

    useEffect(() => {
        const fetchClubData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/clubs/${clubId}`);
                if (!response.ok) throw new Error("Failed to fetch club data");
                const club: ClubDetailType = await response.json();
                setClubData(club);
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error(error instanceof Error ? error.message : error);
                }
                setError(error instanceof Error ? error.message : "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        };
        fetchClubData();
    }, [clubId]);

    const contextValue = useMemo(
        () => ({
            isLoading,
            error,
            clubData,
            isOwner,
            isMember,
        }),
        [isLoading, error, clubData, isOwner, isMember],
    );

    return <ClubPageContext.Provider value={contextValue}>{children}</ClubPageContext.Provider>;
};
