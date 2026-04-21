import { type ButtonHTMLAttributes } from "react";
import { cx } from "css-variants";
import { capitalizeString } from "../../lib/string";

type ButtonType = {
    type?: "submit" | "button" | "reset";
    variant?: "primary" | "secondary" | "danger";
    size?: "small" | "medium" | "large";
    text: string;
    onClick?: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
    type = "button",
    size = "medium",
    variant = "primary",
    text = "",
    onClick,
    ...props
}: ButtonType) => {
    const className = cx({
        button: true,
        [`${size}`]: true,
        [`${variant}`]: true,
    });

    return (
        <button
            className={className}
            type={type}
            onClick={onClick}
            {...props}
        >
            {capitalizeString(text)}
        </button>
    );
};

export default Button;
