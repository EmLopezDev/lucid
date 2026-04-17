import { type ButtonHTMLAttributes } from "react";

type ButtonType = {
    type: "submit" | "button" | "reset";
    text: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ type = "button", text }: ButtonType) => {
    return (
        <button
            className="button"
            type={type}
        >
            {text}
        </button>
    );
};

export default Button;
