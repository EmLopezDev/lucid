import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "css-variants";

type ButtonBase = {
    type?: "submit" | "button" | "reset";
    variant?: "primary" | "secondary" | "danger";
    buttonSize?: "small" | "medium" | "large";
    "aria-label"?: string;
    className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonIconOnly = ButtonBase & {
    icon: ReactNode;
    children?: never;
    iconPosition?: never;
    "aria-label": string;
};

type ButtonTextOnly = ButtonBase & {
    children: ReactNode;
    icon?: never;
    iconPosition?: never;
};

type ButtonIconText = ButtonBase & {
    icon: ReactNode;
    children: ReactNode;
    iconPosition?: "left" | "right";
};

type ButtonProps = ButtonIconOnly | ButtonTextOnly | ButtonIconText;

const Button = ({
    type = "button",
    buttonSize = "medium",
    variant = "primary",
    icon,
    iconPosition = "left",
    children,
    className = "",
    ...props
}: ButtonProps) => {
    const isIconOnly = !!icon && !children;

    const buttonClassName = cx({
        button: true,
        [`button--${buttonSize}`]: true,
        [`button--${variant}`]: true,
        "button--icon-only": isIconOnly,
        className,
    });

    return (
        <button
            className={buttonClassName}
            type={type}
            {...props}
        >
            {/* Icon only */}
            {isIconOnly && (
                <span
                    className="button__icon"
                    aria-hidden="true"
                >
                    {icon}
                </span>
            )}

            {/* Text only */}
            {!icon && children}

            {/* Icon left + text */}
            {icon && children && iconPosition === "left" && (
                <>
                    <span
                        className="button__icon button__icon--left"
                        aria-hidden="true"
                    >
                        {icon}
                    </span>
                    {children}
                </>
            )}

            {/* Icon right + text */}
            {icon && children && iconPosition === "right" && (
                <>
                    {children}
                    <span
                        className="button__icon button__icon--right"
                        aria-hidden="true"
                    >
                        {icon}
                    </span>
                </>
            )}
        </button>
    );
};

export default Button;
