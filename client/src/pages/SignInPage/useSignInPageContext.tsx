import { createContext, useContext, type ChangeEvent, type SubmitEvent } from "react";
import type { UserSigninType } from "../../../../packages/types";

export interface SignInPageContextType {
    isSubmitting: boolean;
    formDataError: string;
    errors: UserSigninType;
    onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmitForm: (e: SubmitEvent<HTMLFormElement>) => void;
    onResetForm: () => void;
}

export const SignInPageContext = createContext<SignInPageContextType | null>(null);

export const useSignInPageContext = () => {
    const context = useContext(SignInPageContext);
    if (!context) {
        throw new Error("useSignInContext must be used within an AppProvider");
    }
    return context;
};
