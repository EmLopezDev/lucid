import {
    useState,
    useCallback,
    useMemo,
    type ReactNode,
    type ChangeEvent,
    type SubmitEvent,
} from "react";
import { objectCopy } from "../../lib/generic";
import { isFormDataValid, type FormRules, hasErrors } from "../../lib/form";
import { API_URL } from "../../config/api";
import { ResetPasswordPageContext } from "./useResetPasswordContext";
import { type UserResetPasswordType } from "@lucid/types";

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
    const [formDataError, setFormDataError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const onPasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState: UserResetPasswordType) => {
            return { ...prevState, new_password: e.target.value };
        });
    }, []);

    const postResetPassword = useCallback(async (d: UserResetPasswordType) => {
        try {
            setIsSubmitting(true);
            const response = await fetch(`${API_URL}/auth/reset-password`, {
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
    }, []);

    const onSubmitForm = useCallback(
        async (e: React.SubmitEvent<HTMLFormElement>) => {
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

            await postResetPassword({ hash: token, new_password: formData.new_password });
        },
        [token, formData, postResetPassword],
    );

    const onResetForm = useCallback(() => {
        setFormData(objectCopy(RESET_PASSWORD_EMPTY_FORM));
        setErrors(objectCopy(RESET_PASSWORD_EMPTY_FORM));
        setFormDataError("");
    }, []);

    const contextValue = useMemo(
        () => ({
            isSubmitting,
            isSuccess,
            formDataError,
            errors,
            password: formData.new_password,
            onPasswordChange,
            onSubmitForm,
            onResetForm,
        }),
        [
            isSubmitting,
            isSuccess,
            errors,
            formDataError,
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
