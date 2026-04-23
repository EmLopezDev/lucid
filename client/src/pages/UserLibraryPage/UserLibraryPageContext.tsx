import { useCallback, useState, type ChangeEvent, type ReactNode } from "react";
import { UserLibraryPageContext } from "./useUserLibraryPageContext";
import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";
import { type SelectOptionType } from "../../components/Select/Select";
import UserLibraryMockData from "../../data/UserLibraryMockData";

export type StatusType = "all" | "playing" | "completed" | "paused" | "wishlist";
export type SortType = "recently" | "alphabetical" | "rated" | "price";

export const UserLibraryPageProvider = ({ children }: { children: ReactNode }) => {
    const [libraryData, setLibraryData] = useState<UserLibraryDataType[]>(UserLibraryMockData);
    const [selectedCard, setSelectedCard] = useState<UserLibraryDataType | null>(null);
    // const [filters, setFilters] = useState<{
    //     searchTitle: string;
    //     status: StatusType;
    //     sort: SortType;
    // }>({
    //     searchTitle: "",
    //     status: "all",
    //     sort: "recently",
    // });
    const [statusValue, setStatusValue] = useState<SelectOptionType>({
        value: "all",
        label: "all",
    });
    const [sortValue, setSortValue] = useState<SelectOptionType>({
        value: "recently",
        label: "recently",
    });

    const statusOptions: SelectOptionType[] = [
        { value: "all", label: "all" },
        { value: "playing", label: "playing" },
        { value: "completed", label: "completed" },
        { value: "paused", label: "paused" },
        { value: "dropped", label: "dropped" },
        { value: "wishlist", label: "wishlist" },
    ];

    const sortOptions: SelectOptionType[] = [
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
    const onLibraryUpdate = (value: UserLibraryDataType[]) => {
        setLibraryData(value);
    };

    const onSearchTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value.toLowerCase();
        const filterByTitle = UserLibraryMockData.filter((data) =>
            data.title.toLowerCase().startsWith(title),
        );
        console.log(filterByTitle);
        onLibraryUpdate(filterByTitle);
    }, []);

    const onStatusSelect = useCallback(
        (option: SelectOptionType) => {
            setStatusValue(option);
            if (option.value === "all") {
                onLibraryUpdate(UserLibraryMockData);
            } else {
                const filterByStatus = libraryData.filter((data) => data.status === option.value);
                onLibraryUpdate(filterByStatus);
            }
        },
        [libraryData],
    );

    const onSortSelect = useCallback(
        (option: SelectOptionType) => {
            setSortValue(option);
            if (option.value === "recently") {
                const sortByDate = libraryData.sort(
                    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
                );
                onLibraryUpdate(sortByDate);
            } else if (option.value === "alphabetical") {
                const sortByTitle = libraryData.sort((a, b) => a.title.localeCompare(b.title));
                onLibraryUpdate(sortByTitle);
            } else if (option.value === "price") {
                const sortByPrice = libraryData.sort(
                    (a, b) => Number(b.price ?? 0) - Number(a.price ?? 0),
                );
                onLibraryUpdate(sortByPrice);
            }
        },
        [libraryData],
    );

    const contextValue = {
        libraryData,
        statusOptions,
        sortOptions,
        selectedCard,
        setSelectedCard,
        statusValue,
        sortValue,
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
