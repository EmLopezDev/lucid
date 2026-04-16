import { createContext, useContext, type JSX } from "react";
import { type UserRegisterType } from "../../../../packages/types";

interface RegisterContextType {
    formDataError: string;
    errors: UserRegisterType;
    onFirstNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onLastNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showFormDataError: () => JSX.Element;
    onSubmitForm: (e: React.SubmitEvent<HTMLFormElement>) => void;
}

export const RegisterContext = createContext<RegisterContextType | null>(null);

export const useRegisterContext = () => {
    const context = useContext(RegisterContext);
    if (!context) {
        throw new Error(
            "useRegisterContext must be used within an AppProvider",
        );
    }
    return context;
};
