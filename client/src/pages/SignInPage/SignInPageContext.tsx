import {
    useState,
    useCallback,
    useMemo,
    type ReactNode,
    type ChangeEvent,
    type SubmitEvent,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import { type UserSigninType, type UserType } from "@lucid/types";
import { SignInPageContext } from "./useSignInPageContext";
import { emailCheck } from "@lib/string";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import { objectCopy } from "@lib/generic";
import { isFormDataValid, type FormRules, hasErrors } from "@lib/form";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@lib/apiFetch";

const SIGNIN_EMPTY_FORM: UserSigninType = {
    email: "",
    password: "",
};

const SIGNIN_RULES: FormRules<UserSigninType> = {
    email: [
        [Boolean, "Email is required"],
        [emailCheck, "Email format is invalid"],
    ],
    password: [
        [Boolean, "Password is required"],
        [(v) => v.length >= 8, "Password must be at least 8 characters"],
    ],
};

export interface SignInPageContextType {
    isSubmitting: boolean;
    formDataError: string;
    errors: UserSigninType;
    email: string;
    password: string;
    unverified: boolean;
    resendSuccess: boolean;
    onResendVerification: () => Promise<void>;
    onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmitForm: (e: SubmitEvent<HTMLFormElement>) => void;
    onResetForm: () => void;
}

export const SignInPageProvider = ({
    children,
    initialValues,
}: {
    children: ReactNode;
    initialValues?: UserSigninType;
}) => {
    const { setUser } = useUserContext();
    const navigation = useNavigate();
    const [searchParams] = useSearchParams();

    const [formData, setFormData] = useState<UserSigninType>(
        objectCopy(initialValues ?? SIGNIN_EMPTY_FORM),
    );
    const [errors, setErrors] = useState<UserSigninType>(objectCopy(SIGNIN_EMPTY_FORM));
    const [formDataError, setFormDataError] = useState("");
    const [unverified, setUnverified] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    const onEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState: UserSigninType) => {
            return { ...prevState, email: e.target.value };
        });
    }, []);

    const onPasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState: UserSigninType) => {
            return { ...prevState, password: e.target.value };
        });
    }, []);

    const signInMutation = useMutation({
        mutationFn: (data: UserSigninType): Promise<UserType> => {
            return apiFetch<UserType>("/auth/signin", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
        },
        meta: { skipErrorToast: true },
        onSuccess: (user) => {
            setUser(user);
            toast.success(`Welcome back, ${user.first_name}`);
            const redirect = searchParams.get("redirect") ?? "/";
            navigation(redirect);
        },
        onError: (error) => {
            if (error instanceof ApiError && error.status === 403) setUnverified(true);
            setFormDataError(error.message);
        },
    });

    const resendVerificationMutation = useMutation({
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
        onSuccess: () => setResendSuccess(true),
        onError: (error) => setFormDataError(error.message),
    });

    const onSubmitForm = useCallback(
        (e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();

            const validationErrors = isFormDataValid(formData, SIGNIN_RULES, SIGNIN_EMPTY_FORM);

            if (hasErrors(validationErrors)) {
                setErrors(validationErrors);
                return;
            }

            signInMutation.mutate(formData);
        },
        [formData, signInMutation],
    );

    const onResetForm = useCallback(() => {
        setFormData(objectCopy(SIGNIN_EMPTY_FORM));
        setErrors(objectCopy(SIGNIN_EMPTY_FORM));
        setFormDataError("");
        setUnverified(false);
        setResendSuccess(false);
    }, []);

    const onResendVerification = useCallback(async () => {
        await resendVerificationMutation.mutateAsync(formData.email).catch(() => {});
    }, [resendVerificationMutation, formData.email]);

    const contextValue = useMemo(
        () => ({
            isSubmitting: signInMutation.isPending,
            formDataError,
            errors,
            unverified,
            resendSuccess,
            email: formData.email,
            password: formData.password,
            onEmailChange,
            onPasswordChange,
            onSubmitForm,
            onResetForm,
            onResendVerification,
        }),
        [
            signInMutation.isPending,
            errors,
            formDataError,
            unverified,
            resendSuccess,
            formData.email,
            formData.password,
            onEmailChange,
            onPasswordChange,
            onSubmitForm,
            onResetForm,
            onResendVerification,
        ],
    );

    return <SignInPageContext.Provider value={contextValue}>{children}</SignInPageContext.Provider>;
};
