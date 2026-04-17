import { type ButtonHTMLAttributes } from "react";

type ButtonType = {
    type: "submit" | "button" | "reset";
    text: string;
    onClick?: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ type = "button", text, onClick, ...props }: ButtonType) => {
    return (
        <button
            className="button"
            type={type}
            onClick={onClick}
            {...props}
        >
            {text}
        </button>
    );
};

export default Button;
