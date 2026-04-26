import {
    createContext,
    useContext,
    type Dispatch,
    type SetStateAction,
    type ChangeEvent,
} from "react";
import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";
import { type FilterType } from "./UserLibraryPageContext";
import { type SortOptionType, type StatusOptionType } from "../../../../packages/types";

interface UserLibraryPageContextType {
    filters: FilterType;
    filteredData: UserLibraryDataType[];
    statusOptions: StatusOptionType[];
    sortOptions: SortOptionType[];
    selectedCard: UserLibraryDataType | null;
    setSelectedCard: Dispatch<SetStateAction<UserLibraryDataType | null>>;
    onSearchTitle: (e: ChangeEvent<HTMLInputElement>) => void;
    onStatusSelect: (option: StatusOptionType) => void;
    onSortSelect: (option: SortOptionType) => void;
    onCardSelect: (id: string) => void;
    onDeleteGameById: (id: string) => void;
}

export const UserLibraryPageContext = createContext<UserLibraryPageContextType | null>(null);

export const useUserLibraryPageContext = () => {
    const context = useContext(UserLibraryPageContext);
    if (!context) {
        throw new Error("useUserLibraryPageContext must be used within an Provider");
    }
    return context;
};
