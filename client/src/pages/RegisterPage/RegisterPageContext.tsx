import { useState, type ReactNode } from "react";
import { nameCheck, emailCheck } from "../../lib/string";
import { Link, useNavigate } from "react-router";
import { RegisterPageContext } from "./useRegisterPageContext";
import { type UserRegisterType } from "../../../../packages/types";

export const RegisterPageProvider = ({ children }: { children: ReactNode }) => {
    const [formData, setFormData] = useState<UserRegisterType>({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<UserRegisterType>({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });

    const [formDataError, setFormDataError] = useState("");

    const navigate = useNavigate();

    const onFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState: UserRegisterType) => {
            return Object.assign({}, prevState, { first_name: e.target.value });
        });
    };

    const onLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState: UserRegisterType) => {
            return Object.assign({}, prevState, { last_name: e.target.value });
        });
    };

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState: UserRegisterType) => {
            return Object.assign({}, prevState, { email: e.target.value });
        });
    };

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState: UserRegisterType) => {
            return Object.assign({}, prevState, { password: e.target.value });
        });
    };

    const isFormDataValid = (data: UserRegisterType) => {
        let errors = {};
        if (!data.first_name) {
            errors = { ...errors, first_name: "First name is required" };
        } else if (!nameCheck(data.first_name)) {
            errors = {
                ...errors,
                first_name: "First name should only be letters",
            };
        }

        if (!data.last_name) {
            errors = { ...errors, last_name: "Last name is required" };
        } else if (!nameCheck(data.last_name)) {
            errors = {
                ...errors,
                last_name: "Last name should only be letters",
            };
        }

        if (!data.email) {
            errors = { ...errors, email: "Email is required" };
        } else if (!emailCheck(data.email)) {
            errors = { ...errors, email: "Email format is invalid" };
        }

        if (!data.password) {
            errors = { ...errors, password: "Password is required" };
        } else if (data.password.length < 8) {
            errors = {
                ...errors,
                password: "Password must be at least 8 characters",
            };
        }

        setErrors(errors as UserRegisterType);

        return Object.keys(errors).length === 0;
    };

    const showFormDataError = () => {
        if (formDataError === "User already exist") {
            return (
                <>
                    <span className="register-page__form-error">
                        {`${formDataError} try`}&nbsp;
                    </span>
                    <Link to="/signin"> signing in</Link>
                </>
            );
        } else {
            return <span className="register-page__form-error center">{formDataError}</span>;
        }
    };

    const registerUser = async (d: UserRegisterType) => {
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
    };

    const onSubmitForm = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isFormDataValid(formData)) {
            registerUser(formData);
        }
    };

    const onResetForm = () => {
        console.log("CLICK");
        setFormData({ first_name: "", last_name: "", email: "", password: "" });
        setErrors({ first_name: "", last_name: "", email: "", password: "" });
        setFormDataError("");
    };

    const contextValue = {
        formDataError,
        errors,
        onFirstNameChange,
        onLastNameChange,
        onEmailChange,
        onPasswordChange,
        showFormDataError,
        onSubmitForm,
        onResetForm,
    };

    return (
        <RegisterPageContext.Provider value={contextValue}>{children}</RegisterPageContext.Provider>
    );
};
