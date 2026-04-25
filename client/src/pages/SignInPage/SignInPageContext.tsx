import { useState, useCallback, useMemo, type ReactNode, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import { type UserSigninType } from "../../../../packages/types";
import { SignInPageContext } from "./useSignInPageContext";
import { emailCheck } from "../../lib/string";
import { useUserContext } from "../../contexts/UserContext/useUserContext";

const EMPTY_FORM: UserSigninType = {
    email: "",
    password: "",
};

const emptyForm = (): UserSigninType => ({ ...EMPTY_FORM });

const validateForm = (data: UserSigninType): UserSigninType => {
    const errors: UserSigninType = emptyForm();

    if (!data.email) {
        errors.email = "Email is required";
    } else if (!emailCheck(data.email)) {
        errors.email = "Email format is invalid";
    }

    if (!data.password) {
        errors.password = "Password is required";
    } else if (data.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
    }

    return errors;
};

const hasErrors = (errors: UserSigninType) => Object.values(errors).some(Boolean);

export const SignInPageProvider = ({ children }: { children: ReactNode }) => {
    const [formData, setFormData] = useState<UserSigninType>(emptyForm);
    const [errors, setErrors] = useState<UserSigninType>(emptyForm);
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
            console.log(validationErrors);
            console.log(hasErrors(validationErrors));

            if (hasErrors(validationErrors)) {
                setErrors(validationErrors);
                return;
            }

            await signInUser(formData);
        },
        [formData, signInUser],
    );

    const onResetForm = useCallback(() => {
        setFormData(emptyForm);
        setErrors(emptyForm);
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
