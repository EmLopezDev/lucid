import { useCallback, useState, type ChangeEvent, type ReactNode } from "react";
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

export const UserLibraryPageProvider = ({ children }: { children: ReactNode }) => {
    // const [libraryData, setLibraryData] = useState<UserLibraryDataType[]>(UserLibraryMockData);
    const [selectedCard, setSelectedCard] = useState<UserLibraryDataType | null>(null);
    const [filters, setFilters] = useState<FilterType>({
        searchTitle: "",
        statusValue: { value: "all", label: "all" },
        sortValue: { value: "recently", label: "recently added" },
    });

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

    const onCardSelect = (id: string) => {
        const [card] = UserLibraryMockData.filter((data) => data._id === id);
        if (!selectedCard) {
            setSelectedCard(card);
        } else if (selectedCard && selectedCard._id !== id) {
            setSelectedCard(card);
        } else {
            setSelectedCard(null);
        }
    };

    const onSearchTitle = (event: ChangeEvent<HTMLInputElement>) => {
        setFilters((prevState) => ({ ...prevState, searchTitle: event.target.value }));
    };

    const onStatusSelect = (option: SelectOptionType) => {
        setFilters((prevState) => ({
            ...prevState,
            statusValue: { value: option.value, label: option.label },
        }));
    };

    const onSortSelect = (option: SortOptionType) => {
        setFilters((prevState) => ({
            ...prevState,
            sortValue: { value: option.value, label: option.label },
        }));
    };

    const filterData = useCallback(() => {
        let dataCopy = [...UserLibraryMockData];
        if (filters.searchTitle) {
            dataCopy = dataCopy.filter((data) =>
                data.title.toLowerCase().startsWith(filters.searchTitle.toLowerCase()),
            );
        }
        if (filters.statusValue) {
            if (filters.statusValue.value === "all") {
                dataCopy = [...dataCopy];
            }
            if (filters.statusValue.value !== "all") {
                dataCopy = dataCopy.filter((data) => data.status === filters.statusValue.value);
            }
        }

        if (filters.sortValue) {
            if (filters.sortValue.value === "recently") {
                dataCopy = dataCopy.sort(
                    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
                );
            }
            if (filters.sortValue.value === "alphabetical") {
                dataCopy = dataCopy.sort((a, b) => a.title.localeCompare(b.title));
            }
            if (filters.sortValue.value === "price") {
                dataCopy = dataCopy.sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0));
            }
        }
        return dataCopy;
    }, [filters]);

    const contextValue = {
        filters,
        libraryData: filterData(),
        statusOptions,
        sortOptions,
        selectedCard,
        setSelectedCard,
        onSearchTitle,
        onStatusSelect,
        onSortSelect,
        onCardSelect,
    };
    return (
        <UserLibraryPageContext.Provider value={contextValue}>
            {children}
        </UserLibraryPageContext.Provider>
    );
};
