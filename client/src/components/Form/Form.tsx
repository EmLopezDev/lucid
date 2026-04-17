import { type ReactNode, type SubmitEvent, type JSX } from "react";
import Button from "../Button/Button";

type FormType = {
    errorText: JSX.Element;
    children: ReactNode;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    handleSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
    onResetForm: () => void;
};

export const Form = ({
    errorText,
    children,
    primaryButtonText = "Submit",
    secondaryButtonText = "Cancel",
    handleSubmit,
    onResetForm,
}: FormType) => {
    return (
        <form
            className="form"
            noValidate
            onSubmit={handleSubmit}
        >
            {children}
            <div className="form-buttons">
                <Button
                    type="reset"
                    text={secondaryButtonText}
                    onClick={onResetForm}
                />
                <Button
                    type="submit"
                    text={primaryButtonText}
                />
            </div>
            <p className="form-error">{errorText}</p>
        </form>
    );
};
