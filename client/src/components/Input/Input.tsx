import { type ChangeEvent, type InputHTMLAttributes, useId } from "react";
import { cx } from "css-variants";

type InputProps = {
    inputSize?: "small" | "medium" | "large";
    label?: string;
    errorText?: string;
    hasErrorText?: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">;

const Input = ({
    inputSize = "medium",
    label,
    errorText,
    hasErrorText = true,
    onChange,
    id,
    ...props
}: InputProps) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <div className="input__container">
            {label && (
                <label
                    htmlFor={inputId}
                    className={cx({
                        input__label: true,
                        [`input__label--${inputSize}`]: inputSize,
                    })}
                >
                    {label}
                    {props.required && (
                        <span
                            className="input__required"
                            aria-hidden="true"
                        >
                            *
                        </span>
                    )}
                </label>
            )}
            <input
                id={inputId}
                className={cx({
                    input: true,
                    [`input--${inputSize}`]: inputSize,
                })}
                onChange={onChange}
                aria-invalid={!!errorText}
                aria-describedby={hasErrorText ? `${inputId}-error` : undefined}
                {...props}
            />
            {hasErrorText && (
                <span
                    id={`${inputId}-error`}
                    className="input__error"
                    role="alert"
                    aria-live="polite"
                >
                    {errorText}
                </span>
            )}
        </div>
    );
};

export default Input;
