import { createContext, useContext, type JSX } from "react";
import { type UserSigninType } from "../../../../packages/types";

interface SignInPageContextType {
    formDataError: string;
    errors: UserSigninType;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showFormDataError: () => JSX.Element;
    onSubmitForm: (e: React.SubmitEvent<HTMLFormElement>) => void;
    onResetForm: () => void;
}

export const SignInPageContext = createContext<SignInPageContextType | null>(
    null,
);

export const useSignInPageContext = () => {
    const context = useContext(SignInPageContext);
    if (!context) {
        throw new Error("useSignInContext must be used within an AppProvider");
    }
    return context;
};
