import { createContext, useContext } from "react";
import { type SignInPageContextType } from "./SignInPageContext";

export const SignInPageContext = createContext<SignInPageContextType | null>(null);

export const useSignInPageContext = () => {
    const context = useContext(SignInPageContext);
    if (!context) {
        throw new Error("useSignInContext must be used within an AppProvider");
    }
    return context;
};
