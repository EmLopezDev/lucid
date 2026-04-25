import { useState, useCallback, useMemo, type ReactNode, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import { type UserSigninType } from "../../../../packages/types";
import { SignInPageContext } from "./useSignInPageContext";
import { emailCheck } from "../../lib/string";
import { useUserContext } from "../../contexts/UserContext/useUserContext";
import { objectCopy } from "../../lib/generic";

const EMPTY_FORM: UserSigninType = {
    email: "",
    password: "",
};

const FIELD_RULES: Record<keyof UserSigninType, [(v: string) => boolean, string][]> = {
    email: [
        [Boolean, "Email is required"],
        [emailCheck, "Email format is invalid"],
    ],
    password: [
        [Boolean, "Password is required"],
        [(v) => v.length >= 8, "Password must be at least 8 characters"],
    ],
};

const validateForm = (data: UserSigninType): UserSigninType => {
    const errors: UserSigninType = objectCopy(EMPTY_FORM);

    for (const field in FIELD_RULES) {
        const key = field as keyof UserSigninType;
        const failed = FIELD_RULES[key].find(([check]) => !check(data[key]));
        if (failed) errors[key] = failed[1];
    }

    return errors;
};

const hasErrors = (errors: UserSigninType) => Object.values(errors).some(Boolean);

export const SignInPageProvider = ({ children }: { children: ReactNode }) => {
    const [formData, setFormData] = useState<UserSigninType>(objectCopy(EMPTY_FORM));
    const [errors, setErrors] = useState<UserSigninType>(objectCopy(EMPTY_FORM));
    const [formDataError, setFormDataError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { setUser } = useUserContext();
    const navigation = useNavigate();

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
                const response = await fetch("http://localhost:8000/api/v1/auth/signin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(d),
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    navigation("/");
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
        [navigation, setUser],
    );

    const onSubmitForm = useCallback(
        async (e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();

            const validationErrors = validateForm(formData);

            if (hasErrors(validationErrors)) {
                setErrors(validationErrors);
                return;
            }

            await signInUser(formData);
        },
        [formData, signInUser],
    );

    const onResetForm = useCallback(() => {
        setFormData(objectCopy(EMPTY_FORM));
        setErrors(objectCopy(EMPTY_FORM));
        setFormDataError("");
    }, []);

    const contextValue = useMemo(
        () => ({
            isSubmitting,
            formDataError,
            errors,
            onEmailChange,
            onPasswordChange,
            onSubmitForm,
            onResetForm,
        }),
        [
            isSubmitting,
            errors,
            formDataError,
            onEmailChange,
            onPasswordChange,
            onSubmitForm,
            onResetForm,
        ],
    );

    return <SignInPageContext.Provider value={contextValue}>{children}</SignInPageContext.Provider>;
};
