import { Link } from "react-router";
import { VerifyEmailPageProvider } from "./VerifyEmailPageContext";
import { useVerifyEmailPageContext } from "./useVerifyEmailPageContext";

const VerifyEmailPageContent = () => {
    const { status, errorMessage } = useVerifyEmailPageContext();

    if (status === "loading") {
        return (
            <div className="verify-email-page">
                <p className="verify-email-page__message">Verifying your email...</p>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="verify-email-page verify-email-page--success">
                <p className="verify-email-page__title">Email verified</p>
                <p className="verify-email-page__message">
                    Your email has been verified. You can now sign in.
                </p>
                <Link to="/signin">Sign in</Link>
            </div>
        );
    }

    return (
        <div className="verify-email-page verify-email-page--error">
            <p className="verify-email-page__title">Invalid link</p>
            <p className="verify-email-page__message">
                {errorMessage ?? "This verification link is invalid or has expired."}
            </p>
        </div>
    );
};

const VerifyEmailPage = () => (
    <VerifyEmailPageProvider>
        <VerifyEmailPageContent />
    </VerifyEmailPageProvider>
);

export default VerifyEmailPage;
