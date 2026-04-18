import { createContext, useContext } from "react";
import { type RegisterPageContextType } from "./RegisterPageContext";

export const RegisterPageContext = createContext<RegisterPageContextType | null>(null);

export const useRegisterPageContext = () => {
    const context = useContext(RegisterPageContext);
    if (!context) {
        throw new Error("useRegisterContext must be used within an AppProvider");
    }
    return context;
};
