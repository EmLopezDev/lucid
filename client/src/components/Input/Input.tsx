import { type ChangeEvent, type InputHTMLAttributes } from "react";
import { cx } from "css-variants";

type Input = {
    type?: "text" | "email" | "password" | "search";
    inputSize?: "small" | "medium" | "large";
    name?: string;
    required?: boolean;
    label?: string;
    errorText?: string;
    hasErrorText?: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({
    type = "text",
    inputSize = "medium",
    name = "",
    required = false,
    label = "",
    errorText = "",
    hasErrorText = true,
    onChange,
    ...props
}: Input) => {
    const inputClassName = cx({
        input: true,
        [`${inputSize}`]: inputSize,
    });

    const inputLabelClassName = cx({
        input__label: true,
        [`input__label__${inputSize}`]: inputSize,
    });

    return (
        <div className="input__container">
            {label ? (
                <label className={inputLabelClassName}>
                    {label}
                    <input
                        className={inputClassName}
                        type={type}
                        name={name}
                        required={required}
                        onChange={onChange}
                        {...props}
                    />
                </label>
            ) : (
                <input
                    className={inputClassName}
                    type={type}
                    name={name}
                    required={required}
                    onChange={onChange}
                    {...props}
                />
            )}
            {hasErrorText && <span className="input__error">{errorText}</span>}
        </div>
    );
};

export default Input;
