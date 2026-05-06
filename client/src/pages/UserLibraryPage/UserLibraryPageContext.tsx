import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from "react";
import { UserLibraryPageContext } from "./useUserLibraryPageContext";
import {
    type UserLibraryDataType,
    type PostUserLibraryGameBodyType,
    type PatchUserLibraryGameBodyType,
} from "../../../../packages/types/UserLibrary";
import {
    type StatusFilterOptionType,
    type StatusOptionType,
    type SortOptionType,
} from "../../../../packages/types/SelectOptionsTypes.ts";
import { sortOptions, statusFilterOptions, statusOptions } from "../../lib/form.ts";
import { filterBySort, filterByStatus, filterByTitle } from "../../lib/filter.ts";
import { useUserContext } from "../../contexts/UserContext/useUserContext.tsx";
import { API_URL } from "../../config/api.ts";

export type FilterType = {
    searchTitle: string;
    statusValue: StatusFilterOptionType;
    sortValue: SortOptionType;
};

export interface UserLibraryPageContextType {
    isLoading: boolean;
    isCardDetailLoading: boolean;
    filters: FilterType;
    filteredData: UserLibraryDataType[];
    statusCounts: Record<string, number>;
    statusFilterOptions: StatusFilterOptionType[];
    statusOptions: StatusOptionType[];
    sortOptions: SortOptionType[];
    selectedCard: UserLibraryDataType | null;
    setSelectedCard: Dispatch<SetStateAction<UserLibraryDataType | null>>;
    onSearchTitle: (e: ChangeEvent<HTMLInputElement>) => void;
    onStatusSelect: (option: StatusFilterOptionType) => void;
    onSortSelect: (option: SortOptionType) => void;
    onCardSelect: (id: string) => void;
    onDeleteGameById: (id: string) => Promise<void>;
    onCloseCardDetail: () => void;
    isAddGameModalOpen: boolean;
    onOpenAddGameModal: () => void;
    onCloseAddGameModal: () => void;
    onAddGame: (data: PostUserLibraryGameBodyType) => Promise<void>;
    onPatchGame: (id: string, data: PatchUserLibraryGameBodyType) => Promise<UserLibraryDataType | null>;
}

export const UserLibraryPageProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isCardDetailLoading, setIsCardDetailLoading] = useState(false);
    const [libraryData, setLibraryData] = useState<UserLibraryDataType[]>([]);
    const [selectedCard, setSelectedCard] = useState<UserLibraryDataType | null>(null);
    const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
    const [filters, setFilters] = useState<FilterType>({
        searchTitle: "",
        statusValue: { value: "all", label: "all" },
        sortValue: { value: "recently", label: "recently added" },
    });

    const { currentUser } = useUserContext();

    const filteredData = useMemo(() => {
        const { searchTitle, statusValue, sortValue } = filters;
        const byTitle = filterByTitle(libraryData, searchTitle);
        const byStatus = filterByStatus(byTitle, statusValue.value);
        return filterBySort(byStatus, sortValue.value);
    }, [filters, libraryData]);

    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = { all: libraryData.length };
        for (const game of libraryData) {
            counts[game.status] = (counts[game.status] ?? 0) + 1;
        }
        return counts;
    }, [libraryData]);

    const onCardSelect = useCallback(
        async (id: string) => {
            const card = libraryData.find((d) => d._id === id) ?? null;
            const isDeselecting = card && selectedCard?._id === id;
            if (isDeselecting) {
                setSelectedCard(null);
                return;
            }
            setIsCardDetailLoading(true);
            setSelectedCard(card);
            // Fetch additional card details here when the endpoint is ready
            setIsCardDetailLoading(false);
        },
        [libraryData, selectedCard],
    );

    const onSearchTitle = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSelectedCard(null);
        setFilters((prevState) => ({ ...prevState, searchTitle: event.target.value }));
    }, []);

    const onStatusSelect = useCallback((option: StatusFilterOptionType) => {
        setSelectedCard(null);
        setFilters((prevState) => ({ ...prevState, statusValue: option }));
    }, []);

    const onSortSelect = useCallback((option: SortOptionType) => {
        setSelectedCard(null);
        setFilters((prevState) => ({ ...prevState, sortValue: option }));
    }, []);

    const onDeleteGameById = useCallback(
        async (id: string) => {
            try {
                const response = await fetch(
                    `${API_URL}/user/${currentUser?._id}/library/${id}`,
                    { method: "DELETE" },
                );
                if (!response.ok) throw new Error("Failed to delete game");
                setLibraryData((prev) => prev.filter((d) => d._id !== id));
                setSelectedCard(null);
            } catch (error) {
                console.error(error);
            }
        },
        [currentUser?._id],
    );

    const onCloseCardDetail = useCallback(() => {
        setSelectedCard(null);
    }, []);

    const onPatchGame = useCallback(
        async (id: string, data: PatchUserLibraryGameBodyType): Promise<UserLibraryDataType | null> => {
            try {
                const response = await fetch(`${API_URL}/user/${currentUser?._id}/library/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (!response.ok) throw new Error("Failed to update game");
                const updatedGame: UserLibraryDataType = await response.json();
                setLibraryData((prev) => prev.map((d) => (d._id === id ? updatedGame : d)));
                setSelectedCard(updatedGame);
                return updatedGame;
            } catch (error) {
                console.error(error);
                return null;
            }
        },
        [currentUser?._id],
    );

    const onOpenAddGameModal = useCallback(() => setIsAddGameModalOpen(true), []);
    const onCloseAddGameModal = useCallback(() => setIsAddGameModalOpen(false), []);

    const onAddGame = useCallback(
        async (data: PostUserLibraryGameBodyType) => {
            try {
                const response = await fetch(`${API_URL}/user/${currentUser?._id}/library`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (!response.ok) throw new Error("Failed to add game");
                const newGame: UserLibraryDataType = await response.json();
                setLibraryData((prev) => [newGame, ...prev]);
                setIsAddGameModalOpen(false);
            } catch (error) {
                console.error(error);
            }
        },
        [currentUser?._id],
    );

    useEffect(() => {
        const fetchUserLibraryGames = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/user/${currentUser?._id}/library`);
                const data = await response.json();
                setLibraryData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserLibraryGames();
    }, [currentUser]);

    const contextValue = useMemo(
        () => ({
            isLoading,
            isCardDetailLoading,
            filters,
            filteredData,
            statusCounts,
            statusOptions,
            statusFilterOptions,
            sortOptions,
            selectedCard,
            setSelectedCard,
            onSearchTitle,
            onStatusSelect,
            onSortSelect,
            onCardSelect,
            onDeleteGameById,
            onCloseCardDetail,
            isAddGameModalOpen,
            onOpenAddGameModal,
            onCloseAddGameModal,
            onAddGame,
            onPatchGame,
        }),
        [
            isLoading,
            isCardDetailLoading,
            filters,
            filteredData,
            statusCounts,
            selectedCard,
            onSearchTitle,
            onStatusSelect,
            onSortSelect,
            onCardSelect,
            onDeleteGameById,
            onCloseCardDetail,
            isAddGameModalOpen,
            onOpenAddGameModal,
            onCloseAddGameModal,
            onAddGame,
            onPatchGame,
        ],
    );
    return (
        <UserLibraryPageContext.Provider value={contextValue}>
            {children}
        </UserLibraryPageContext.Provider>
    );
};
