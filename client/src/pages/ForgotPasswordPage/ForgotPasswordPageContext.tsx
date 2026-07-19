import {
    useState,
    useCallback,
    useMemo,
    type ReactNode,
    type ChangeEvent,
    type SubmitEvent,
} from "react";
import { useMutation } from "@tanstack/react-query";
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

const postForgotPassword = async (email: string) => {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }
};

export const ForgotPasswordPageProvider = ({ children }: { children: ReactNode }) => {
    const [formData, setFormData] = useState<UserForgotPasswordType>(
        objectCopy(FORGOT_PASSWORD_EMPTY_FORM),
    );
    const [errors, setErrors] = useState<UserForgotPasswordType>(
        objectCopy(FORGOT_PASSWORD_EMPTY_FORM),
    );
    const [canResend, setCanResend] = useState(false);

    const onEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState: UserForgotPasswordType) => {
            return { ...prevState, email: e.target.value };
        });
    }, []);

    const forgotPasswordMutation = useMutation({
        mutationFn: postForgotPassword,
        meta: { skipErrorToast: true },
        onSuccess: () => {
            setTimeout(() => setCanResend(true), 60_000);
        },
    });

    const resendMutation = useMutation({
        mutationFn: postForgotPassword,
        meta: { skipErrorToast: true },
    });

    const onSubmitForm = useCallback(
        (e: React.SubmitEvent<HTMLFormElement>) => {
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

            forgotPasswordMutation.mutate(formData.email);
        },
        [formData, forgotPasswordMutation],
    );

    const onResend = useCallback(async () => {
        await resendMutation.mutateAsync(forgotPasswordMutation.variables ?? "").catch(() => {});
    }, [resendMutation, forgotPasswordMutation.variables]);

    const onResetForm = useCallback(() => {
        setFormData(objectCopy(FORGOT_PASSWORD_EMPTY_FORM));
        setErrors(objectCopy(FORGOT_PASSWORD_EMPTY_FORM));
        forgotPasswordMutation.reset();
    }, [forgotPasswordMutation]);

    const contextValue = useMemo(
        () => ({
            isSubmitting: forgotPasswordMutation.isPending,
            isSuccess: forgotPasswordMutation.isSuccess,
            canResend,
            resendSuccess: resendMutation.isSuccess,
            formDataError:
                forgotPasswordMutation.error instanceof Error
                    ? forgotPasswordMutation.error.message
                    : "",
            errors,
            email: formData.email,
            onEmailChange,
            onSubmitForm,
            onResetForm,
            onResend,
        }),
        [
            forgotPasswordMutation.isPending,
            forgotPasswordMutation.isSuccess,
            forgotPasswordMutation.error,
            canResend,
            resendMutation.isSuccess,
            errors,
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
