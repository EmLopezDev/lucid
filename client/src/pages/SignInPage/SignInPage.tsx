import { useCallback } from "react";
import { Link } from "react-router";
import { SignInPageProvider } from "./SignInPageContext";
import { useSignInPageContext } from "./useSignInPageContext";
import Form from "../../components/Form/Form";
import Input from "../../components/Input/Input";

const SignInPageContent = () => {
    const { errors, formDataError, onEmailChange, onPasswordChange, onSubmitForm, onResetForm } =
        useSignInPageContext();

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
            onResetForm={onResetForm}
            primaryButtonText="Sign In"
            secondaryButtonText="Clear"
            buttonSize="large"
        >
            <Input
                label="Email"
                type="email"
                inputSize="large"
                onChange={onEmailChange}
                errorText={errors.email}
            />
            <Input
                label="Password"
                type="password"
                inputSize="large"
                onChange={onPasswordChange}
                errorText={errors.password}
            />
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
