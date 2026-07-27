import {
    useState,
    useMemo,
    useCallback,
    type ReactNode,
    type ChangeEvent,
    type SubmitEvent,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { nameCheck, emailCheck } from "@lib/string";
import { RegisterPageContext } from "./useRegisterPageContext";
import { type UserRegisterType } from "@lucid/types";
import { objectCopy } from "@lib/generic";
import { isFormDataValid, type FormRules, hasErrors } from "@lib/form";
import { apiFetch } from "@lib/apiFetch";

const REGISTER_EMPTY_FORM: UserRegisterType = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
};

const REGISTER_RULES: FormRules<UserRegisterType> = {
    first_name: [
        [Boolean, "First name is required"],
        [nameCheck, "First name should only be letters"],
    ],
    last_name: [
        [Boolean, "Last name is required"],
        [nameCheck, "Last name should only be letters"],
    ],
    email: [
        [Boolean, "Email is required"],
        [emailCheck, "Email format is invalid"],
    ],
    password: [
        [Boolean, "Password is required"],
        [(v) => v.length >= 8, "Password must be at least 8 characters"],
    ],
};

export interface RegisterPageContextType {
    isSubmitting: boolean;
    isSuccess: boolean;
    canResend: boolean;
    resendSuccess: boolean;
    formDataError: string;
    errors: UserRegisterType;
    onFirstNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onLastNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmitForm: (e: SubmitEvent<HTMLFormElement>) => void;
    onResetForm: () => void;
    onResendVerification: () => Promise<void>;
}

export const RegisterPageProvider = ({ children }: { children: ReactNode }) => {
    const [formData, setFormData] = useState<UserRegisterType>(objectCopy(REGISTER_EMPTY_FORM));
    const [errors, setErrors] = useState<UserRegisterType>(objectCopy(REGISTER_EMPTY_FORM));
    const [canResend, setCanResend] = useState(false);

    const onFirstNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState: UserRegisterType) => {
            return Object.assign({}, prevState, { first_name: e.target.value });
        });
    }, []);

    const onLastNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState: UserRegisterType) => {
            return Object.assign({}, prevState, { last_name: e.target.value });
        });
    }, []);

    const onEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState: UserRegisterType) => {
            return Object.assign({}, prevState, { email: e.target.value });
        });
    }, []);

    const onPasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState: UserRegisterType) => {
            return Object.assign({}, prevState, { password: e.target.value });
        });
    }, []);

    const registerMutation = useMutation({
        mutationFn: (data: UserRegisterType) =>
            apiFetch("/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }),
        meta: { skipErrorToast: true },
        onSuccess: () => {
            setTimeout(() => setCanResend(true), 60_000);
        },
    });

    const resendMutation = useMutation({
        mutationFn: (email: string) =>
            apiFetch(
                "/auth/resend-verification",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                },
                "Something went wrong. Please try again.",
            ),
        meta: { skipErrorToast: true },
    });

    const onSubmitForm = useCallback(
        (e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            const validationErrors = isFormDataValid(formData, REGISTER_RULES, REGISTER_EMPTY_FORM);
            if (hasErrors(validationErrors)) {
                setErrors(validationErrors);
                return;
            }
            registerMutation.mutate(formData);
        },
        [formData, registerMutation],
    );

    const onResendVerification = useCallback(async () => {
        await resendMutation.mutateAsync(registerMutation.variables?.email ?? "").catch(() => {});
    }, [resendMutation, registerMutation.variables]);

    const onResetForm = useCallback(() => {
        setFormData(objectCopy(REGISTER_EMPTY_FORM));
        setErrors(objectCopy(REGISTER_EMPTY_FORM));
        registerMutation.reset();
        resendMutation.reset();
    }, [registerMutation, resendMutation]);

    const contextValue = useMemo(
        () => ({
            isSubmitting: registerMutation.isPending,
            isSuccess: registerMutation.isSuccess,
            canResend,
            resendSuccess: resendMutation.isSuccess,
            formDataError:
                (registerMutation.error instanceof Error && registerMutation.error.message) ||
                (resendMutation.error instanceof Error && resendMutation.error.message) ||
                "",
            errors,
            onFirstNameChange,
            onLastNameChange,
            onEmailChange,
            onPasswordChange,
            onSubmitForm,
            onResetForm,
            onResendVerification,
        }),
        [
            registerMutation.isPending,
            registerMutation.isSuccess,
            registerMutation.error,
            canResend,
            resendMutation.isSuccess,
            resendMutation.error,
            errors,
            onFirstNameChange,
            onLastNameChange,
            onEmailChange,
            onPasswordChange,
            onSubmitForm,
            onResetForm,
            onResendVerification,
        ],
    );

    return (
        <RegisterPageContext.Provider value={contextValue}>{children}</RegisterPageContext.Provider>
    );
};
