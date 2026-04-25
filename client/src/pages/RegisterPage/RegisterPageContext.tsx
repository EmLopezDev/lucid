import { useState, type ReactNode, type ChangeEvent, useMemo, useCallback } from "react";
import { nameCheck, emailCheck } from "../../lib/string";
import { useNavigate } from "react-router";
import { RegisterPageContext } from "./useRegisterPageContext";
import { type UserRegisterType } from "../../../../packages/types";
import { objectCopy } from "../../lib/generic";

const EMPTY_FORM: UserRegisterType = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
};

const FIELD_RULES: Record<keyof UserRegisterType, [(v: string) => boolean, string][]> = {
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

const validateForm = (data: UserRegisterType) => {
    const errors = objectCopy(EMPTY_FORM);

    for (const field in FIELD_RULES) {
        const key = field as keyof UserRegisterType;
        const failed = FIELD_RULES[key].find(([check]) => !check(data[key]));
        if (failed) errors[key] = failed[1];
    }

    return errors;
};

const hasErrors = (errors: UserRegisterType) => Object.values(errors).some(Boolean);

export const RegisterPageProvider = ({ children }: { children: ReactNode }) => {
    const [formData, setFormData] = useState<UserRegisterType>(objectCopy(EMPTY_FORM));
    const [errors, setErrors] = useState<UserRegisterType>(objectCopy(EMPTY_FORM));
    const [formDataError, setFormDataError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

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

    const registerUser = useCallback(
        async (d: UserRegisterType) => {
            setIsSubmitting(true);
            try {
                const response = await fetch("http://localhost:8000/api/v1/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(d),
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        navigate("/signin");
                    }
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
        [navigate],
    );

    const onSubmitForm = useCallback(
        (e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            const validationErrors = validateForm(formData);
            if (hasErrors(validationErrors)) {
                setErrors(validationErrors);
                return;
            }
            registerUser(formData);
        },
        [formData, registerUser],
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
            onFirstNameChange,
            onLastNameChange,
            onEmailChange,
            onPasswordChange,
            onSubmitForm,
            onResetForm,
        }),
        [
            isSubmitting,
            formDataError,
            errors,
            onFirstNameChange,
            onLastNameChange,
            onEmailChange,
            onPasswordChange,
            onSubmitForm,
            onResetForm,
        ],
    );

    return (
        <RegisterPageContext.Provider value={contextValue}>{children}</RegisterPageContext.Provider>
    );
};
