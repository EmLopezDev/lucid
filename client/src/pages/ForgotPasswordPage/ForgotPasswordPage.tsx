import { Link } from "react-router";
import Form from "@components/Form";
import Input from "@components/Input";
import { ForgotPasswordPageProvider } from "./ForgotPasswordPageContext";
import { useForgotPasswordPageContext } from "./useForgotPasswordPageContext";

const ForgotPasswordPageContent = () => {
    const {
        errors,
        isSuccess,
        canResend,
        resendSuccess,
        onEmailChange,
        onResetForm,
        onSubmitForm,
        onResend,
    } = useForgotPasswordPageContext();

    if (isSuccess) {
        return (
            <div className="forgot-password-page__success">
                <p className="forgot-password-page__success-title">Check your email</p>
                <p className="forgot-password-page__success-message">
                    If an account exists for that email, a reset link has been sent.
                </p>
                <Link to="/signin">Back to sign in</Link>
                {canResend && !resendSuccess && (
                    <button
                        type="button"
                        className="forgot-password-page__resend-button"
                        onClick={onResend}
                    >
                        Didn&apos;t receive it? Resend reset email
                    </button>
                )}
                {resendSuccess && (
                    <span className="forgot-password-page__resend-success">
                        Reset email resent. Check your inbox.
                    </span>
                )}
            </div>
        );
    }

    return (
        <Form
            secondaryButtonText="Clear"
            onSubmit={onSubmitForm}
            onCancel={onResetForm}
        >
            <Input
                label="Email"
                type="email"
                inputSize="large"
                onChange={onEmailChange}
                errorText={errors.email}
            />
        </Form>
    );
};

const ForgotPasswordPage = () => {
    return (
        <ForgotPasswordPageProvider>
            <ForgotPasswordPageContent />
        </ForgotPasswordPageProvider>
    );
};

export default ForgotPasswordPage;
