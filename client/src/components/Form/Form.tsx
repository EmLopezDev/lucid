import { type ReactNode, type SubmitEvent, type JSX } from "react";
import Button from "../Button/Button";

type FormType = {
    errorText: JSX.Element;
    children: ReactNode;
    buttonSize?: "small" | "medium" | "large";
    primaryButtonText?: string;
    secondaryButtonText?: string;
    onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
    onResetForm?: () => void;
};

const Form = ({
    errorText,
    children,
    buttonSize = "medium",
    primaryButtonText = "Submit",
    secondaryButtonText = "Cancel",
    onSubmit,
    onResetForm,
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
                    text={secondaryButtonText}
                    onClick={onResetForm}
                    size={buttonSize}
                />
                <Button
                    type="submit"
                    text={primaryButtonText}
                    size={buttonSize}
                />
            </div>
            <p className="form-error">{errorText}</p>
        </form>
    );
};

export default Form;
