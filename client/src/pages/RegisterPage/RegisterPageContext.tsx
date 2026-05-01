import {
    useState,
    useMemo,
    useCallback,
    type ReactNode,
    type ChangeEvent,
    type SubmitEvent,
} from "react";
import { nameCheck, emailCheck } from "../../lib/string";
import { useNavigate } from "react-router";
import { RegisterPageContext } from "./useRegisterPageContext";
import { type UserRegisterType } from "../../../../packages/types";
import { objectCopy } from "../../lib/generic";
import { isFormDataValid, type FormRules, hasErrors } from "../../lib/form";
import { API_URL } from "../../config/api";

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
    formDataError: string;
    errors: UserRegisterType;
    onFirstNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onLastNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmitForm: (e: SubmitEvent<HTMLFormElement>) => void;
    onResetForm: () => void;
}

export const RegisterPageProvider = ({ children }: { children: ReactNode }) => {
    const [formData, setFormData] = useState<UserRegisterType>(objectCopy(REGISTER_EMPTY_FORM));
    const [errors, setErrors] = useState<UserRegisterType>(objectCopy(REGISTER_EMPTY_FORM));
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
                const response = await fetch(`${API_URL}/auth/register`, {
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
            const validationErrors = isFormDataValid(formData, REGISTER_RULES, REGISTER_EMPTY_FORM);
            if (hasErrors(validationErrors)) {
                setErrors(validationErrors);
                return;
            }
            registerUser(formData);
        },
        [formData, registerUser],
    );

    const onResetForm = useCallback(() => {
        setFormData(objectCopy(REGISTER_EMPTY_FORM));
        setErrors(objectCopy(REGISTER_EMPTY_FORM));
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
