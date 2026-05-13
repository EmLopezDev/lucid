import { createContext, useContext } from "react";
import { type ResetPasswordPageContextType } from "./ResetPasswordPageContext";

export const ResetPasswordPageContext = createContext<ResetPasswordPageContextType | null>(null);

export const useResetPasswordPageContext = () => {
    const context = useContext(ResetPasswordPageContext);
    if (!context) {
        throw new Error("useResetPasswordContext must be used within an Provider");
    }
    return context;
};
