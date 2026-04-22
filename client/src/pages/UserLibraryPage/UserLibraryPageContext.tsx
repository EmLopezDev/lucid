import { useEffect, useEffectEvent, useState, type ReactNode } from "react";
import { UserLibraryPageContext } from "./useUserLibraryPageContext";
import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";
import { type SelectOptionType } from "../../components/Select/Select";
import UserLibraryMockData from "../../data/UserLibraryMockData";

export type StatusType = "all" | "playing" | "completed" | "paused" | "wishlist";
export type FilterType = "recently" | "alphabetical" | "rated" | "price";

export const UserLibraryPageProvider = ({ children }: { children: ReactNode }) => {
    const [libraryData, setLibraryData] = useState<UserLibraryDataType[]>(UserLibraryMockData);
    const [selectedCard, setSelectedCard] = useState<UserLibraryDataType | null>(null);
    const [statusValue, setStatusValue] = useState<SelectOptionType>({
        value: "all",
        label: "all",
    });
    const [filterValue, setFilterValue] = useState<SelectOptionType>({
        value: "recently",
        label: "recently added",
    });

    const statusOptions: SelectOptionType[] = [
        { value: "all", label: "all" },
        { value: "playing", label: "playing" },
        { value: "completed", label: "completed" },
        { value: "paused", label: "paused" },
        { value: "dropped", label: "dropped" },
        { value: "wishlist", label: "wishlist" },
    ];

    const filterOptions: SelectOptionType[] = [
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

    const onStatusSelect = (option: SelectOptionType) => {
        setStatusValue(option);
    };

    const onFilterSelect = (option: SelectOptionType) => {
        setFilterValue(option);
    };

    const handleUpdateLibrary = useEffectEvent((value: UserLibraryDataType[]) => {
        setLibraryData(value);
    });

    useEffect(() => {
        console.log(statusValue);
        if (statusValue.value === "all") {
            handleUpdateLibrary(UserLibraryMockData);
        }
        if (statusValue.value === "playing") {
            const filterPlaying = UserLibraryMockData.filter((data) => data.status === "playing");
            handleUpdateLibrary(filterPlaying);
        }
        if (statusValue.value === "completed") {
            const filterCompleted = UserLibraryMockData.filter(
                (data) => data.status === "completed",
            );
            handleUpdateLibrary(filterCompleted);
        }
        if (statusValue.value === "dropped") {
            const filterDropped = UserLibraryMockData.filter((data) => data.status === "dropped");
            handleUpdateLibrary(filterDropped);
        }
        if (statusValue.value === "paused") {
            const filterPaused = UserLibraryMockData.filter((data) => data.status === "paused");
            handleUpdateLibrary(filterPaused);
        }

        if (statusValue.value === "wishlist") {
            const filterWishlist = UserLibraryMockData.filter((data) => data.status === "wishlist");
            handleUpdateLibrary(filterWishlist);
        }
    }, [statusValue]);

    const contextValue = {
        libraryData,
        statusOptions,
        filterOptions,
        selectedCard,
        setSelectedCard,
        statusValue,
        filterValue,
        onStatusSelect,
        onFilterSelect,
        onCardSelect,
    };
    return (
        <UserLibraryPageContext.Provider value={contextValue}>
            {children}
        </UserLibraryPageContext.Provider>
    );
};
