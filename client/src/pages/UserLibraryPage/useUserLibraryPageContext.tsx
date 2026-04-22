import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import { type SelectOptionType } from "../../components/Select/Select";
import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";

interface UserLibraryPageContextType {
    libraryData: UserLibraryDataType[];
    statusOptions: SelectOptionType[];
    filterOptions: SelectOptionType[];
    selectedCard: UserLibraryDataType | null;
    statusValue: SelectOptionType;
    filterValue: SelectOptionType;
    setSelectedCard: Dispatch<SetStateAction<UserLibraryDataType | null>>;
    onStatusSelect: (option: SelectOptionType) => void;
    onFilterSelect: (option: SelectOptionType) => void;
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
