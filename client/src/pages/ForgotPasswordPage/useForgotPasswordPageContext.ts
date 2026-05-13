import { createContext, useContext } from "react";
import { type ForgotPasswordPageContextType } from "./ForgotPasswordPageContext";

export const ForgotPasswordPageContext = createContext<ForgotPasswordPageContextType | null>(null);

export const useForgotPasswordPageContext = () => {
    const context = useContext(ForgotPasswordPageContext);
    if (!context) {
        throw new Error("useForgotPasswordContext must be used within an Provider");
    }
    return context;
};
