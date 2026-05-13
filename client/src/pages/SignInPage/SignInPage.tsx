import { useCallback } from "react";
import { Link, NavLink } from "react-router";
import { SignInPageProvider } from "./SignInPageContext";
import { useSignInPageContext } from "./useSignInPageContext";
import Form from "../../components/Form/Form";
import Input from "../../components/Input/Input";

const SignInPageContent = () => {
    const {
        errors,
        formDataError,
        email,
        password,
        onEmailChange,
        onPasswordChange,
        onSubmitForm,
        onResetForm,
    } = useSignInPageContext();

    const showFormDataError = useCallback(() => {
        if (formDataError === "User doesn't exist") {
            return (
                <>
                    <span>{`${formDataError} try`}&nbsp;</span>
                    <Link to="/register"> registering</Link>
                </>
            );
        } else {
            return <span className="register-page__error">{formDataError}</span>;
        }
    }, [formDataError]);

    return (
        <Form
            onSubmit={onSubmitForm}
            errorText={showFormDataError}
            onCancel={onResetForm}
            primaryButtonText="Sign In"
            secondaryButtonText="Clear"
            buttonSize="large"
        >
            <Input
                label="Email"
                type="email"
                inputSize="large"
                value={email}
                onChange={onEmailChange}
                errorText={errors.email}
            />
            <Input
                label="Password"
                type="password"
                inputSize="large"
                value={password}
                onChange={onPasswordChange}
                errorText={errors.password}
            />
            <NavLink
                className="signin-page__forgot-password"
                to="/forgot-password"
            >
                Forgot Password
            </NavLink>
        </Form>
    );
};

const SignInPage = () => {
    return (
        <SignInPageProvider>
            <SignInPageContent />
        </SignInPageProvider>
    );
};

export default SignInPage;
