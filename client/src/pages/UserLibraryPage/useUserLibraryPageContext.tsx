import {
    createContext,
    useContext,
    type Dispatch,
    type SetStateAction,
    type ChangeEvent,
} from "react";
import { type SelectOptionType } from "../../components/Select/Select";
import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";

interface UserLibraryPageContextType {
    libraryData: UserLibraryDataType[];
    statusOptions: SelectOptionType[];
    sortOptions: SelectOptionType[];
    selectedCard: UserLibraryDataType | null;
    statusValue: SelectOptionType;
    sortValue: SelectOptionType;
    setSelectedCard: Dispatch<SetStateAction<UserLibraryDataType | null>>;
    onSearchTitle: (e: ChangeEvent<HTMLInputElement>) => void;
    onStatusSelect: (option: SelectOptionType) => void;
    onSortSelect: (option: SelectOptionType) => void;
    onCardSelect: (id: string) => void;
}

export const UserLibraryPageContext = createContext<UserLibraryPageContextType | null>(null);

export const useUserLibraryPageContext = () => {
    const context = useContext(UserLibraryPageContext);
    if (!context) {
        throw new Error("useUserLibraryPageContext must be used within an Provider");
    }
    return context;
};
