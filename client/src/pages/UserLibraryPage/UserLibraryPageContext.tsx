import { useCallback, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import { UserLibraryPageContext } from "./useUserLibraryPageContext";
import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";
import { type SelectOptionType } from "../../components/Select/Select";
import UserLibraryMockData from "../../data/UserLibraryMockData";

export type StatusType = "all" | "playing" | "completed" | "paused" | "dropped" | "wishlist";
export type SortValueType = "recently" | "alphabetical" | "rated" | "price";
export type SortLabelType = "recently added" | "Title A-Z" | "Highest Rated" | "Highest Price";

export type StatusOptionType = {
    value: StatusType | string;
    label: StatusType | string;
};

export type SortOptionType = {
    value: SortValueType | string;
    label: SortLabelType | string;
};

export type FilterType = {
    searchTitle: string;
    statusValue: StatusOptionType;
    sortValue: SortOptionType;
};

const statusOptions: StatusOptionType[] = [
    { value: "all", label: "all" },
    { value: "playing", label: "playing" },
    { value: "completed", label: "completed" },
    { value: "paused", label: "paused" },
    { value: "dropped", label: "dropped" },
    { value: "wishlist", label: "wishlist" },
];

const sortOptions: SortOptionType[] = [
    { value: "recently", label: "recently added" },
    { value: "alphabetical", label: "Title A-Z" },
    { value: "rated", label: "Highest Rated" },
    { value: "price", label: "Highest Price" },
];

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

export const UserLibraryPageProvider = ({ children }: { children: ReactNode }) => {
    const [libraryData, setLibraryData] = useState<UserLibraryDataType[]>(UserLibraryMockData);
    const [selectedCard, setSelectedCard] = useState<UserLibraryDataType | null>(null);
    const [filters, setFilters] = useState<FilterType>({
        searchTitle: "",
        statusValue: { value: "all", label: "all" },
        sortValue: { value: "recently", label: "recently added" },
    });

    const onCardSelect = useCallback(
        (id: string) => {
            setSelectedCard((prev) => {
                const card = libraryData.find((d) => d._id === id) ?? null;
                return prev?._id === id ? null : card;
            });
        },
        [libraryData],
    );

    const onSearchTitle = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSelectedCard(null);
        setFilters((prevState) => ({ ...prevState, searchTitle: event.target.value }));
    }, []);

    const onStatusSelect = useCallback((option: SelectOptionType) => {
        setSelectedCard(null);
        setFilters((prevState) => ({
            ...prevState,
            statusValue: { value: option.value, label: option.label },
        }));
    }, []);

    const onSortSelect = useCallback((option: SortOptionType) => {
        setSelectedCard(null);
        setFilters((prevState) => ({
            ...prevState,
            sortValue: { value: option.value, label: option.label },
        }));
    }, []);

    const filteredData = useMemo(() => {
        const { searchTitle, statusValue, sortValue } = filters;
        const byTitle = filterByTitle(libraryData, searchTitle);
        const byStatus = filterByStatus(byTitle, statusValue.value);
        return filterBySort(byStatus, sortValue.value);
    }, [filters, libraryData]);

    const onDeleteGameById = useCallback((id: string) => {
        setLibraryData((prev) => prev.filter((d) => d._id !== id));
        setSelectedCard(null);
    }, []);

    const contextValue = useMemo(
        () => ({
            filters,
            filteredData,
            statusOptions,
            sortOptions,
            selectedCard,
            setSelectedCard,
            onSearchTitle,
            onStatusSelect,
            onSortSelect,
            onCardSelect,
            onDeleteGameById,
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
