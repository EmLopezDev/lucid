import {
    useState,
    useCallback,
    useMemo,
    type ReactNode,
    type ChangeEvent,
    type SubmitEvent,
} from "react";
import { useNavigate } from "react-router";
import { type UserSigninType } from "@lucid/types";
import { SignInPageContext } from "./useSignInPageContext";
import { emailCheck } from "@lib/string";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import { objectCopy } from "@lib/generic";
import { isFormDataValid, type FormRules, hasErrors } from "@lib/form";
import { API_URL } from "@config/api";
import { toast } from "sonner";

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

    const [formData, setFormData] = useState<UserSigninType>(
        objectCopy(initialValues ?? SIGNIN_EMPTY_FORM),
    );
    const [errors, setErrors] = useState<UserSigninType>(objectCopy(SIGNIN_EMPTY_FORM));
    const [formDataError, setFormDataError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const signInUser = useCallback(
        async (d: UserSigninType) => {
            setIsSubmitting(true);
            try {
                const response = await fetch(`${API_URL}/auth/signin`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(d),
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    toast.success(`Welcome back, ${data.first_name}`);
                    navigation("/");
                } else {
                    if (response.status === 403) setUnverified(true);
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
        [navigation, setUser],
    );

    const onSubmitForm = useCallback(
        async (e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();

            const validationErrors = isFormDataValid(formData, SIGNIN_RULES, SIGNIN_EMPTY_FORM);

            if (hasErrors(validationErrors)) {
                setErrors(validationErrors);
                return;
            }

            await signInUser(formData);
        },
        [formData, signInUser],
    );

    const onResetForm = useCallback(() => {
        setFormData(objectCopy(SIGNIN_EMPTY_FORM));
        setErrors(objectCopy(SIGNIN_EMPTY_FORM));
        setFormDataError("");
        setUnverified(false);
        setResendSuccess(false);
    }, []);

    const onResendVerification = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/auth/resend-verification`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: formData.email }),
            });
            if (response.ok) {
                setResendSuccess(true);
            } else {
                const error = await response.json();
                setFormDataError(error.message);
            }
        } catch {
            setFormDataError("Something went wrong. Please try again.");
        }
    }, [formData.email]);

    const contextValue = useMemo(
        () => ({
            isSubmitting,
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
            isSubmitting,
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
