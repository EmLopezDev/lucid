import { Link } from "react-router";
import Form from "@components/Form/Form";
import Input from "@components/Input/Input";
import { ForgotPasswordPageProvider } from "./ForgotPasswordPageContext";
import { useForgotPasswordPageContext } from "./useForgotPasswordPageContext";

const ForgotPasswordPageContent = () => {
    const { errors, isSuccess, onEmailChange, onResetForm, onSubmitForm } = useForgotPasswordPageContext();

    if (isSuccess) {
        return (
            <div className="forgot-password-page__success">
                <p className="forgot-password-page__success-title">Check your email</p>
                <p className="forgot-password-page__success-message">
                    If an account exists for that email, a reset link has been sent.
                </p>
                <Link to="/signin">Back to sign in</Link>
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
