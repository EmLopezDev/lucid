import {
    useState,
    useCallback,
    useMemo,
    type ReactNode,
    type ChangeEvent,
    type SubmitEvent,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { objectCopy } from "@lib/generic";
import { isFormDataValid, type FormRules, hasErrors } from "@lib/form";
import { ResetPasswordPageContext } from "./useResetPasswordContext";
import { type UserResetPasswordType } from "@lucid/types";
import { apiFetch } from "@lib/apiFetch";

const RESET_PASSWORD_EMPTY_FORM: UserResetPasswordType = {
    hash: "",
    new_password: "",
};

const RESET_PASSWORD_RULES: FormRules<UserResetPasswordType> = {
    hash: [],
    new_password: [
        [Boolean, "Password is required"],
        [(v) => v.length >= 8, "Password must be at least 8 characters"],
    ],
};

export interface ResetPasswordPageContextType {
    isSubmitting: boolean;
    isSuccess: boolean;
    formDataError: string;
    errors: UserResetPasswordType;
    password: string;
    onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmitForm: (e: SubmitEvent<HTMLFormElement>) => void;
    onResetForm: () => void;
}

export const ResetPasswordPageProvider = ({
    children,
    token,
}: {
    children: ReactNode;
    token: string;
}) => {
    const [formData, setFormData] = useState<UserResetPasswordType>(
        objectCopy(RESET_PASSWORD_EMPTY_FORM),
    );
    const [errors, setErrors] = useState<UserResetPasswordType>(
        objectCopy(RESET_PASSWORD_EMPTY_FORM),
    );

    const onPasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState: UserResetPasswordType) => {
            return { ...prevState, new_password: e.target.value };
        });
    }, []);

    const resetPasswordMutation = useMutation({
        mutationFn: (data: UserResetPasswordType) =>
            apiFetch(
                "/auth/reset-password",
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                },
                "Something went wrong, try again",
            ),
        meta: { skipErrorToast: true },
    });

    const onSubmitForm = useCallback(
        (e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();

            const validationErrors = isFormDataValid(
                formData,
                RESET_PASSWORD_RULES,
                RESET_PASSWORD_EMPTY_FORM,
            );

            if (hasErrors(validationErrors)) {
                setErrors(validationErrors);
                return;
            }

            resetPasswordMutation.mutate({ hash: token, new_password: formData.new_password });
        },
        [token, formData, resetPasswordMutation],
    );

    const onResetForm = useCallback(() => {
        setFormData(objectCopy(RESET_PASSWORD_EMPTY_FORM));
        setErrors(objectCopy(RESET_PASSWORD_EMPTY_FORM));
        resetPasswordMutation.reset();
    }, [resetPasswordMutation]);

    const contextValue = useMemo(
        () => ({
            isSubmitting: resetPasswordMutation.isPending,
            isSuccess: resetPasswordMutation.isSuccess,
            formDataError:
                resetPasswordMutation.error instanceof Error
                    ? resetPasswordMutation.error.message
                    : "",
            errors,
            password: formData.new_password,
            onPasswordChange,
            onSubmitForm,
            onResetForm,
        }),
        [
            resetPasswordMutation.isPending,
            resetPasswordMutation.isSuccess,
            resetPasswordMutation.error,
            errors,
            formData.new_password,
            onPasswordChange,
            onSubmitForm,
            onResetForm,
        ],
    );

    return (
        <ResetPasswordPageContext.Provider value={contextValue}>
            {children}
        </ResetPasswordPageContext.Provider>
    );
};
