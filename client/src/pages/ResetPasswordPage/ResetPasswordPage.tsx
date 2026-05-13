import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { ResetPasswordPageProvider } from "./ResetPasswordPageContext";
import { useResetPasswordPageContext } from "./useResetPasswordContext";
import Form from "../../components/Form/Form";
import Input from "../../components/Input/Input";

const ResetPasswordPageContent = () => {
    const { errors, formDataError, isSuccess, onPasswordChange, onSubmitForm, onResetForm } =
        useResetPasswordPageContext();
    const navigate = useNavigate();

    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        if (!isSuccess) return;
        if (countdown === 0) {
            navigate("/signin");
            return;
        }
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [isSuccess, countdown, navigate]);

    if (isSuccess) {
        return (
            <div className="forgot-password-page__success">
                <p className="forgot-password-page__success-title">Password reset!</p>
                <p className="forgot-password-page__success-message">
                    Your password has been updated. Redirecting to sign in...
                </p>
                <span className="forgot-password-page__countdown">{countdown}</span>
            </div>
        );
    }

    return (
        <Form
            secondaryButtonText="Clear"
            onSubmit={onSubmitForm}
            onCancel={onResetForm}
            errorText={formDataError ? () => formDataError : undefined}
        >
            <Input
                label="Password"
                type="password"
                inputSize="large"
                onChange={onPasswordChange}
                errorText={errors.new_password}
            />
        </Form>
    );
};

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";

    return (
        <ResetPasswordPageProvider token={token}>
            <ResetPasswordPageContent />
        </ResetPasswordPageProvider>
    );
};

export default ResetPasswordPage;
