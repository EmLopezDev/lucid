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
import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";
import {
    type StatusFilterOptionType,
    type StatusOptionType,
    type SortOptionType,
    type SortValueType,
} from "../../../../packages/types/SelectOptionsTypes.ts";
import { type StatusType } from "../../../../packages/types/UserLibrary";
import UserLibraryMockData from "../../data/UserLibraryMockData";
import { sortOptions, statusFilterOptions, statusOptions } from "../../lib/form.ts";

const filterByTitle = (data: UserLibraryDataType[], title: string) => {
    if (!title) return data;
    return data.filter((d) => {
        return d.title.toLowerCase().startsWith(title.toLowerCase());
    });
};

const filterByStatus = (data: UserLibraryDataType[], status: StatusType | string) => {
    if (status === "all") {
        return [...data];
    } else {
        return data.filter((d) => d.status === status);
    }
};

const filterBySort = (data: UserLibraryDataType[], sort: SortValueType | string) => {
    if (sort === "recently") {
        return [...data].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
    } else if (sort === "alphabetical") {
        return [...data].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "rated") {
        return [...data].sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
    } else {
        return [...data].sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0));
    }
};

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
    const [libraryData, setLibraryData] = useState<UserLibraryDataType[]>(() => [
        ...UserLibraryMockData,
    ]);
    const [selectedCard, setSelectedCard] = useState<UserLibraryDataType | null>(null);
    const [filters, setFilters] = useState<FilterType>({
        searchTitle: "",
        statusValue: { value: "all", label: "all" },
        sortValue: { value: "recently", label: "recently added" },
    });

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
        ],
    );
    return (
        <UserLibraryPageContext.Provider value={contextValue}>
            {children}
        </UserLibraryPageContext.Provider>
    );
};
