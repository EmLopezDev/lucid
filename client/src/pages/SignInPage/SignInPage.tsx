import { useCallback } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { SignInPageProvider } from "./SignInPageContext";
import { useSignInPageContext } from "./useSignInPageContext";
import Form from "@components/Form";
import Input from "@components/Input";

const SignInPageContent = () => {
    const {
        errors,
        formDataError,
        email,
        password,
        unverified,
        resendSuccess,
        isSubmitting,
        onEmailChange,
        onPasswordChange,
        onSubmitForm,
        onResetForm,
        onResendVerification,
    } = useSignInPageContext();

    const showFormDataError = useCallback(() => {
        if (formDataError === "User doesn't exist") {
            return (
                <>
                    <span>{`${formDataError} try`}&nbsp;</span>
                    <Link to="/register"> registering</Link>
                </>
            );
        }
        return (
            <>
                <span>{formDataError}</span>
                {unverified && !resendSuccess && (
                    <button
                        type="button"
                        className="signin-page__resend-button"
                        onClick={onResendVerification}
                    >
                        Resend verification email
                    </button>
                )}
                {resendSuccess && (
                    <span className="signin-page__resend-success">
                        Verification email sent. Check your inbox.
                    </span>
                )}
            </>
        );
    }, [formDataError, unverified, resendSuccess, onResendVerification]);

    return (
        <Form
            onSubmit={onSubmitForm}
            errorText={showFormDataError}
            onCancel={onResetForm}
            primaryButtonText="Sign In"
            secondaryButtonText="Clear"
            buttonSize="large"
            isLoading={isSubmitting}
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
    const location = useLocation();
    const initialValues = location.state?.demo
        ? { email: "demo@lucid.com", password: "lucid-demo" }
        : undefined;
    const notice: string | undefined = location.state?.notice;

    return (
        <SignInPageProvider initialValues={initialValues}>
            {notice && <p className="signin-page__notice">{notice}</p>}
            <SignInPageContent />
        </SignInPageProvider>
    );
};

export default SignInPage;
