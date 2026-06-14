import { useMemo, useState, useEffect, useCallback, type ReactNode, type ChangeEvent } from "react";
import { type GamingClubType } from "@lucid/types";
import { GamingClubPageContext } from "./useGamingClubPageContext";
import { API_URL } from "@config/api";
import { filterByName } from "@lib/filter";

type CreateClubType = {
    clubName: string;
    visibility: "public" | "private";
    avatar: string;
    description: string;
};

export type GamingClubPageContextType = {
    isLoading: boolean;
    error: string | null;
    filteredClubData: GamingClubType[];
    createClub: CreateClubType;
    isCreateClubModalOpen: boolean;
    handleOnSearchClub: (event: ChangeEvent<HTMLInputElement>) => void;
    handleOnClubName: (event: ChangeEvent<HTMLInputElement>) => void;
    handleOnClubAvatar: (value: string) => void;
    handleOnClubVisibility: (value: string) => void;
    handleOnClubDescription: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    onOpenCreateClubModal: () => void;
    onCloseCreateClubModal: () => void;
    refetch: () => void;
};

export const GamingClubPageProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clubData, setClubData] = useState<GamingClubType[]>([]);
    const [filterData, setFilterData] = useState({ searchName: "" });
    const [createClub, setCreateClub] = useState<CreateClubType>({
        clubName: "",
        visibility: "public",
        avatar: "",
        description: "",
    });
    const [isCreateClubModalOpen, setIsCreateClubModalOpen] = useState(false);
    const [fetchTrigger, setFetchTrigger] = useState(0);

    const filteredClubData = useMemo(() => {
        return filterByName(clubData, filterData.searchName);
    }, [clubData, filterData]);

    const handleOnSearchClub = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setFilterData((prevState) => ({ ...prevState, searchName: event.target.value }));
    }, []);

    const handleOnClubName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setCreateClub((prevState) => ({
            ...prevState,
            clubName: event.target.value,
        }));
    }, []);

    const handleOnClubVisibility = useCallback((value: string) => {
        setCreateClub((prevState) => ({
            ...prevState,
            visibility: value as "public" | "private",
        }));
    }, []);

    const handleOnClubAvatar = useCallback((value: string) => {
        setCreateClub((prevState) => ({ ...prevState, avatar: value }));
    }, []);

    const handleOnClubDescription = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
        setCreateClub((prevState) => ({
            ...prevState,
            description: event.target.value,
        }));
    }, []);

    const refetch = useCallback(() => setFetchTrigger((n) => n + 1), []);

    const onOpenCreateClubModal = useCallback(() => setIsCreateClubModalOpen(true), []);
    const onCloseCreateClubModal = useCallback(() => {
        setIsCreateClubModalOpen(false);
        setCreateClub({ clubName: "", visibility: "public", avatar: "", description: "" });
    }, []);

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
            isCreateClubModalOpen,
            filteredClubData,
            createClub,
            handleOnSearchClub,
            handleOnClubName,
            handleOnClubVisibility,
            handleOnClubAvatar,
            handleOnClubDescription,
            onOpenCreateClubModal,
            onCloseCreateClubModal,
            refetch,
        }),
        [
            isLoading,
            error,
            isCreateClubModalOpen,
            filteredClubData,
            createClub,
            handleOnSearchClub,
            handleOnClubName,
            handleOnClubVisibility,
            handleOnClubAvatar,
            handleOnClubDescription,
            onOpenCreateClubModal,
            onCloseCreateClubModal,
            refetch,
        ],
    );

    return (
        <GamingClubPageContext.Provider value={contextValue}>
            {children}
        </GamingClubPageContext.Provider>
    );
};
