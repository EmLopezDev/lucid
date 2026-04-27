import { Link } from "react-router";
import { RegisterPageProvider } from "./RegisterPageContext";
import { useRegisterPageContext } from "./useRegisterPageContext";
import Input from "../../components/Input/Input";
import Form from "../../components/Form/Form";
import { useCallback } from "react";

const RegisterPageContent = () => {
    const {
        errors,
        formDataError,
        onFirstNameChange,
        onLastNameChange,
        onEmailChange,
        onPasswordChange,
        onSubmitForm,
        onResetForm,
    } = useRegisterPageContext();

    const showFormDataError = useCallback(() => {
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
    }, [formDataError]);

    return (
        <Form
            onSubmit={onSubmitForm}
            errorText={showFormDataError}
            onCancel={onResetForm}
            primaryButtonText="Register"
            secondaryButtonText="Clear"
        >
            <Input
                type="text"
                name="first_name"
                label="First Name"
                inputSize="large"
                errorText={errors.first_name}
                required
                onChange={onFirstNameChange}
            />
            <Input
                type="text"
                name="last_name"
                label="Last Name"
                inputSize="large"
                errorText={errors.last_name}
                required
                onChange={onLastNameChange}
            />
            <Input
                type="email"
                name="email"
                label="Email"
                inputSize="large"
                errorText={errors.email}
                required
                onChange={onEmailChange}
            />
            <Input
                type="password"
                name="password"
                label="Password"
                inputSize="large"
                errorText={errors.password}
                required
                onChange={onPasswordChange}
            />
        </Form>
    );
};

const RegisterPage = () => {
    return (
        <RegisterPageProvider>
            <RegisterPageContent />
        </RegisterPageProvider>
    );
};

export default RegisterPage;
