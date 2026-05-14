import { createContext, useContext } from "react";
import { type VerifyEmailPageContextType } from "./VerifyEmailPageContext";

export const VerifyEmailPageContext = createContext<VerifyEmailPageContextType | null>(null);

export const useVerifyEmailPageContext = () => {
    const context = useContext(VerifyEmailPageContext);
    if (!context) {
        throw new Error("useVerifyEmailPageContext must be used within a Provider");
    }
    return context;
};
