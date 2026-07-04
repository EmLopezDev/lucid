import {
    useCallback,
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
} from "@lucid/types";
import {
    type StatusFilterOptionType,
    type StatusOptionType,
    type SortOptionType,
} from "../../types/SelectOptionsTypes";
import { sortOptions, statusFilterOptions, statusOptions } from "@lib/form";
import { filterBySort, filterByStatus, filterByTitle } from "@lib/filter";
import { useUserLibraryContext } from "@contexts/UserLibraryContext/useUserLibraryContext";

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
    isAddGameModalOpen: boolean;
    isDetailClosing: boolean;
    setSelectedCard: Dispatch<SetStateAction<UserLibraryDataType | null>>;
    onSearchTitle: (e: ChangeEvent<HTMLInputElement>) => void;
    onStatusSelect: (option: StatusFilterOptionType) => void;
    onSortSelect: (option: SortOptionType) => void;
    onCardSelect: (id: string) => void;
    onCloseCardDetail: () => void;
    onOpenAddGameModal: () => void;
    onCloseAddGameModal: () => void;
    handleOnAddGame: (data: PostUserLibraryGameBodyType) => void;
    handleOnPatchGame: (
        id: string,
        data: PatchUserLibraryGameBodyType,
    ) => Promise<UserLibraryDataType | null>;
    handleOnDeleteGameById: (id: string) => Promise<void>;
}

export const UserLibraryPageProvider = ({ children }: { children: ReactNode }) => {
    const [isCardDetailLoading, setIsCardDetailLoading] = useState(false);
    const [selectedCard, setSelectedCard] = useState<UserLibraryDataType | null>(null);
    const [isDetailClosing, setIsDetailClosing] = useState(false);
    const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
    const [filters, setFilters] = useState<FilterType>({
        searchTitle: "",
        statusValue: { value: "all", label: "all" },
        sortValue: { value: "recently", label: "recently added" },
    });

    const { isLoading, libraryData, onAddGame, onPatchGame, onDeleteGameById } =
        useUserLibraryContext();

    const filteredData = useMemo(() => {
        const { searchTitle, statusValue, sortValue } = filters;
        const byTitle = filterByTitle(libraryData, searchTitle);
        const byStatus = filterByStatus(byTitle, statusValue.value);
        return filterBySort(byStatus, sortValue.value);
    }, [filters, libraryData]);

    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = { all: libraryData.length };
        for (const game of libraryData) {
            if (!game.status) continue;
            counts[game.status] = (counts[game.status] ?? 0) + 1;
        }
        return counts;
    }, [libraryData]);

    const onCardSelect = useCallback(
        async (id: string) => {
            const card = libraryData.find((d) => d._id === id) ?? null;
            const isDeselecting = card && selectedCard?._id === id;
            if (isDeselecting) {
                setIsDetailClosing(true);
                return;
            }
            setIsDetailClosing(false);
            setIsCardDetailLoading(true);
            setSelectedCard(card);
            // Fetch additional card details here when the endpoint is ready
            setIsCardDetailLoading(false);
        },
        [libraryData, selectedCard],
    );

    const onSearchTitle = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSelectedCard(null);
        setIsDetailClosing(false);
        setFilters((prevState) => ({ ...prevState, searchTitle: event.target.value }));
    }, []);

    const onStatusSelect = useCallback((option: StatusFilterOptionType) => {
        setSelectedCard(null);
        setIsDetailClosing(false);
        setFilters((prevState) => ({ ...prevState, statusValue: option }));
    }, []);

    const onSortSelect = useCallback((option: SortOptionType) => {
        setSelectedCard(null);
        setIsDetailClosing(false);
        setFilters((prevState) => ({ ...prevState, sortValue: option }));
    }, []);

    const onCloseCardDetail = useCallback(() => {
        setSelectedCard(null);
        setIsDetailClosing(false);
    }, []);

    const onOpenAddGameModal = useCallback(() => setIsAddGameModalOpen(true), []);
    const onCloseAddGameModal = useCallback(() => setIsAddGameModalOpen(false), []);

    const handleOnAddGame = useCallback(
        async (data: PostUserLibraryGameBodyType) => {
            await onAddGame(data);
            setIsAddGameModalOpen(false);
        },
        [onAddGame],
    );

    const handleOnPatchGame = useCallback(
        async (
            id: string,
            data: PatchUserLibraryGameBodyType,
        ): Promise<UserLibraryDataType | null> => {
            const updatedGame = await onPatchGame(id, data);
            setSelectedCard(updatedGame);
            return updatedGame;
        },
        [onPatchGame],
    );

    const handleOnDeleteGameById = useCallback(
        async (id: string) => {
            await onDeleteGameById(id);
            setSelectedCard(null);
            setIsDetailClosing(false);
        },
        [onDeleteGameById],
    );

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
            isDetailClosing,
            onSearchTitle,
            onStatusSelect,
            onSortSelect,
            onCardSelect,
            onCloseCardDetail,
            isAddGameModalOpen,
            onOpenAddGameModal,
            onCloseAddGameModal,
            handleOnAddGame,
            handleOnPatchGame,
            handleOnDeleteGameById,
        }),
        [
            isLoading,
            isCardDetailLoading,
            filters,
            filteredData,
            statusCounts,
            selectedCard,
            isDetailClosing,
            onSearchTitle,
            onStatusSelect,
            onSortSelect,
            onCardSelect,
            onCloseCardDetail,
            isAddGameModalOpen,
            onOpenAddGameModal,
            onCloseAddGameModal,
            handleOnAddGame,
            handleOnPatchGame,
            handleOnDeleteGameById,
        ],
    );
    return (
        <UserLibraryPageContext.Provider value={contextValue}>
            {children}
        </UserLibraryPageContext.Provider>
    );
};
