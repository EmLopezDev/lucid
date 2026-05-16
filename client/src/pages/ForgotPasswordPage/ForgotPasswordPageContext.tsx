import {
    useState,
    useRef,
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
    canResend: boolean;
    resendSuccess: boolean;
    formDataError: string;
    errors: UserForgotPasswordType;
    email: string;
    onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmitForm: (e: SubmitEvent<HTMLFormElement>) => void;
    onResetForm: () => void;
    onResend: () => Promise<void>;
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
    const [canResend, setCanResend] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const submittedEmail = useRef("");

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
                    submittedEmail.current = d.email;
                    setIsSuccess(true);
                    setTimeout(() => setCanResend(true), 60_000);
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

    const onResend = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: submittedEmail.current }),
            });
            if (response.ok) {
                setResendSuccess(true);
            }
        } catch {
            // silently ignore — the endpoint never exposes whether the email exists
        }
    }, []);

    const onResetForm = useCallback(() => {
        setFormData(objectCopy(FORGOT_PASSWORD_EMPTY_FORM));
        setErrors(objectCopy(FORGOT_PASSWORD_EMPTY_FORM));
        setFormDataError("");
    }, []);

    const contextValue = useMemo(
        () => ({
            isSubmitting,
            isSuccess,
            canResend,
            resendSuccess,
            formDataError,
            errors,
            email: formData.email,
            onEmailChange,
            onSubmitForm,
            onResetForm,
            onResend,
        }),
        [
            isSubmitting,
            isSuccess,
            canResend,
            resendSuccess,
            errors,
            formDataError,
            formData.email,
            onEmailChange,
            onSubmitForm,
            onResetForm,
            onResend,
        ],
    );

    return (
        <ForgotPasswordPageContext.Provider value={contextValue}>
            {children}
        </ForgotPasswordPageContext.Provider>
    );
};
