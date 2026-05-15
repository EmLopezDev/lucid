import {
    useState,
    useCallback,
    useMemo,
    type ReactNode,
    type ChangeEvent,
    type SubmitEvent,
} from "react";
import { emailCheck } from "@lib/string";
import { objectCopy } from "@lib/generic";
import { isFormDataValid, type FormRules, hasErrors } from "@lib/form";
import { API_URL } from "@config/api";
import { ForgotPasswordPageContext } from "./useForgotPasswordPageContext";
import { type UserForgotPasswordType } from "@lucid/types";

const FORGOT_PASSWORD_EMPTY_FORM: UserForgotPasswordType = {
    email: "",
};

const FORGOT_PASSWORD_RULES: FormRules<UserForgotPasswordType> = {
    email: [
        [Boolean, "Email is required"],
        [emailCheck, "Email format is invalid"],
    ],
};

export interface ForgotPasswordPageContextType {
    isSubmitting: boolean;
    isSuccess: boolean;
    formDataError: string;
    errors: UserForgotPasswordType;
    email: string;
    onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmitForm: (e: SubmitEvent<HTMLFormElement>) => void;
    onResetForm: () => void;
}

export const ForgotPasswordPageProvider = ({ children }: { children: ReactNode }) => {
    const [formData, setFormData] = useState<UserForgotPasswordType>(
        objectCopy(FORGOT_PASSWORD_EMPTY_FORM),
    );
    const [errors, setErrors] = useState<UserForgotPasswordType>(
        objectCopy(FORGOT_PASSWORD_EMPTY_FORM),
    );
    const [formDataError, setFormDataError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const onEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState: UserForgotPasswordType) => {
            return { ...prevState, email: e.target.value };
        });
    }, []);

    const postForgotPassword = useCallback(
        async (d: UserForgotPasswordType) => {
            try {
                setIsSubmitting(true);
                const response = await fetch(`${API_URL}/auth/forgot-password`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(d),
                });
                if (response.ok) {
                    setIsSuccess(true);
                } else {
                    const error = await response.json();
                    setFormDataError(error.message);
                }
            } catch (error) {
                if (error instanceof Error) {
                    setFormDataError(error.message);
                }
            } finally {
                setIsSubmitting(false);
            }
        },
        [],
    );

    const onSubmitForm = useCallback(
        async (e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();

            const validationErrors = isFormDataValid(
                formData,
                FORGOT_PASSWORD_RULES,
                FORGOT_PASSWORD_EMPTY_FORM,
            );

            if (hasErrors(validationErrors)) {
                setErrors(validationErrors);
                return;
            }

            await postForgotPassword(formData);
        },
        [formData, postForgotPassword],
    );

    const onResetForm = useCallback(() => {
        setFormData(objectCopy(FORGOT_PASSWORD_EMPTY_FORM));
        setErrors(objectCopy(FORGOT_PASSWORD_EMPTY_FORM));
        setFormDataError("");
    }, []);

    const contextValue = useMemo(
        () => ({
            isSubmitting,
            isSuccess,
            formDataError,
            errors,
            email: formData.email,
            onEmailChange,
            onSubmitForm,
            onResetForm,
        }),
        [
            isSubmitting,
            isSuccess,
            errors,
            formDataError,
            formData.email,
            onEmailChange,
            onSubmitForm,
            onResetForm,
        ],
    );

    return (
        <ForgotPasswordPageContext.Provider value={contextValue}>
            {children}
        </ForgotPasswordPageContext.Provider>
    );
};
