import Button from "@components/Button";

const ErrorFallback = ({ resetError }: { resetError: () => void }) => {
    return (
        <div className="error-fallback">
            <h1 className="error-fallback__title">Something went wrong</h1>
            <p className="error-fallback__message">
                An unexpected error occurred. The team has been notified.
            </p>
            <Button onClick={resetError}>Try again</Button>
        </div>
    );
};

export default ErrorFallback;
