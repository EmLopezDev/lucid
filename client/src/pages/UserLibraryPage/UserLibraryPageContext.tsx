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
import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";
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
    filters: FilterType;
    filteredData: UserLibraryDataType[];
    statusFilterOptions: StatusFilterOptionType[];
    statusOptions: StatusOptionType[];
    sortOptions: SortOptionType[];
    selectedCard: UserLibraryDataType | null;
    setSelectedCard: Dispatch<SetStateAction<UserLibraryDataType | null>>;
    onSearchTitle: (e: ChangeEvent<HTMLInputElement>) => void;
    onStatusSelect: (option: StatusFilterOptionType) => void;
    onSortSelect: (option: SortOptionType) => void;
    onCardSelect: (id: string) => void;
    onDeleteGameById: (id: string) => void;
    onCloseCardDetail: () => void;
}

export const UserLibraryPageProvider = ({ children }: { children: ReactNode }) => {
    const [libraryData, setLibraryData] = useState<UserLibraryDataType[]>([]);
    const [selectedCard, setSelectedCard] = useState<UserLibraryDataType | null>(null);
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

    const onCardSelect = useCallback(
        (id: string) => {
            const card = libraryData.find((d) => d._id === id) ?? null;
            setSelectedCard((prev) => (prev?._id === id ? null : card));
        },
        [libraryData],
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

    const onDeleteGameById = useCallback((id: string) => {
        setLibraryData((prev) => prev.filter((d) => d._id !== id));
        setSelectedCard(null);
    }, []);

    const onCloseCardDetail = useCallback(() => {
        setSelectedCard(null);
    }, []);

    useEffect(() => {
        const fetchUserLibraryGames = async () => {
            try {
                const response = await fetch(`${API_URL}/user/${currentUser?._id}/library`);
                const data = await response.json();
                setLibraryData(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserLibraryGames();
    }, [currentUser]);

    const contextValue = useMemo(
        () => ({
            filters,
            filteredData,
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
        }),
        [
            filters,
            filteredData,
            selectedCard,
            onSearchTitle,
            onStatusSelect,
            onSortSelect,
            onCardSelect,
            onDeleteGameById,
            onCloseCardDetail,
        ],
    );
    return (
        <UserLibraryPageContext.Provider value={contextValue}>
            {children}
        </UserLibraryPageContext.Provider>
    );
};
