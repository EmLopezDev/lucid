import { type ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router";
import { type UserSigninType } from "../../../../packages/types";
import { SignInPageContext } from "./useSignInPageContext";
import { emailCheck } from "../../lib/string";
// import { useUserContext } from "./UserContext";

export const SignInPageProvider = ({ children }: { children: ReactNode }) => {
    const [formData, setFormData] = useState<UserSigninType>({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<UserSigninType>({
        email: "",
        password: "",
    });

    const [formDataError, setFormDataError] = useState("");

    // const { setUser } = useUserContext();

    const navigation = useNavigate();

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState: UserSigninType) => {
            return Object.assign({}, prevState, { email: e.target.value });
        });
    };

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState: UserSigninType) => {
            return Object.assign({}, prevState, { password: e.target.value });
        });
    };

    const isFormDataValid = (data: UserSigninType) => {
        let errors = {};

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

        setErrors(errors as UserSigninType);

        return Object.keys(errors).length === 0;
    };

    const showFormDataError = () => {
        if (formDataError === "User doesn't exist") {
            return (
                <>
                    <span>{`${formDataError} try`}&nbsp;</span>
                    <Link to="/register"> registering</Link>
                </>
            );
        } else {
            return (
                <span className="register-page__error">{formDataError}</span>
            );
        }
    };

    const signInUser = async (d: UserSigninType) => {
        const response = await fetch(
            "http://localhost:8000/api/v1/auth/signin",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(d),
            },
        );
        if (response.ok) {
            const data = await response.json();
            if (data) {
                // setUser(data);
                navigation("/");
            }
        } else {
            const error = await response.json();
            setFormDataError(error.message);
        }
    };

    const onSubmitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isFormDataValid(formData)) {
            signInUser(formData);
        }
    };

    const onResetForm = () => {
        setFormData({ email: "", password: "" });
        setErrors({ email: "", password: "" });
        setFormDataError("");
    };

    const contextValue = {
        formDataError,
        errors,
        onEmailChange,
        onPasswordChange,
        showFormDataError,
        onSubmitForm,
        onResetForm,
    };

    return (
        <SignInPageContext.Provider value={contextValue}>
            {children}
        </SignInPageContext.Provider>
    );
};
