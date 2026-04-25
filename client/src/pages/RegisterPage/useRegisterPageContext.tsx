import { createContext, useContext, type ChangeEvent, type SubmitEvent } from "react";
import { type UserRegisterType } from "../../../../packages/types";

interface RegisterPageContextType {
    isSubmitting: boolean;
    formDataError: string;
    errors: UserRegisterType;
    onFirstNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onLastNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmitForm: (e: SubmitEvent<HTMLFormElement>) => void;
    onResetForm: () => void;
}

export const RegisterPageContext = createContext<RegisterPageContextType | null>(null);

export const useRegisterPageContext = () => {
    const context = useContext(RegisterPageContext);
    if (!context) {
        throw new Error("useRegisterContext must be used within an AppProvider");
    }
    return context;
};
