import {
    createContext,
    useContext,
    type JSX,
    type SubmitEvent,
    type ChangeEvent,
} from "react";
import { type UserRegisterType } from "../../../../packages/types";

interface RegisterPageContextType {
    formDataError: string;
    errors: UserRegisterType;
    onFirstNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onLastNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
    showFormDataError: () => JSX.Element;
    onSubmitForm: (e: SubmitEvent<HTMLFormElement>) => void;
    onResetForm: () => void;
}

export const RegisterPageContext =
    createContext<RegisterPageContextType | null>(null);

export const useRegisterPageContext = () => {
    const context = useContext(RegisterPageContext);
    if (!context) {
        throw new Error(
            "useRegisterContext must be used within an AppProvider",
        );
    }
    return context;
};
