import { type ChangeEvent, type InputHTMLAttributes } from "react";

type Input = {
    type?: "text" | "email" | "password" | "search";
    name?: string;
    required?: boolean;
    label?: string;
    errorText?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({
    type = "text",
    name = "",
    required = false,
    label = "",
    errorText = "",
    onChange,
    ...props
}: Input) => {
    return (
        <div className="input__container">
            {label ? (
                <label className="input__label">
                    {label}
                    <input
                        className="input"
                        type={type}
                        name={name}
                        required={required}
                        onChange={onChange}
                        {...props}
                    />
                </label>
            ) : (
                <input
                    className="input"
                    type={type}
                    name={name}
                    required={required}
                    onChange={onChange}
                    {...props}
                />
            )}
            <span className="input__error">{errorText}</span>
        </div>
    );
};

export default Input;
