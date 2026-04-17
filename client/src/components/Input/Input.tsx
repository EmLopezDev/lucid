import { type ChangeEvent, type InputHTMLAttributes } from "react";

type Input = {
    type: "text" | "email" | "password";
    name: string;
    required: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({
    name = "",
    required = false,
    type = "text",
    onChange,
    ...props
}: Input) => {
    return (
        <>
            <input
                className="input"
                type={type}
                name={name}
                required={required}
                onChange={onChange}
                {...props}
            />
        </>
    );
};

export default Input;
