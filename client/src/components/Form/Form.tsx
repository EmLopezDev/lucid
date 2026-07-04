import { type ReactNode, type SubmitEvent, type JSX } from "react";
import Button from "@components/Button";

type FormType = {
    errorText?: () => JSX.Element | string;
    children: ReactNode;
    buttonSize?: "small" | "medium" | "large";
    primaryButtonText?: string;
    primaryButtonDisabled?: boolean;
    secondaryButtonText?: string;
    onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
    onCancel?: () => void;
};

const Form = ({
    errorText,
    children,
    buttonSize = "medium",
    primaryButtonText = "Submit",
    primaryButtonDisabled,
    secondaryButtonText = "Cancel",
    onSubmit,
    onCancel,
}: FormType) => {
    return (
        <form
            className="form"
            noValidate
            onSubmit={onSubmit}
        >
            {children}
            <div className="form-buttons">
                <Button
                    type="reset"
                    onClick={onCancel}
                    buttonSize={buttonSize}
                    variant="secondary"
                >
                    {secondaryButtonText}
                </Button>
                <Button
                    type="submit"
                    buttonSize={buttonSize}
                    disabled={primaryButtonDisabled}
                >
                    {primaryButtonText}
                </Button>
            </div>
            {errorText && <p className="form-error">{errorText()}</p>}
        </form>
    );
};

export default Form;
