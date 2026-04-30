import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "css-variants";
import Icon from "../Icon/Icon";
import { type IconName } from "../Icon/IconMap";

type ButtonBase = {
    type?: "submit" | "button" | "reset";
    variant?: "primary" | "secondary" | "danger" | "transparent";
    buttonSize?: "small" | "medium" | "large";
} & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonIconOnly = ButtonBase & {
    icon: IconName;
    children?: never;
    iconPosition?: never;
};

type ButtonTextOnly = ButtonBase & {
    children: ReactNode;
    icon?: never;
    iconPosition?: never;
};

type ButtonIconText = ButtonBase & {
    icon: IconName;
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
    ...props
}: ButtonProps) => {
    const isIconOnly = !!icon && !children;

    const className = cx({
        button: true,
        [`button--${buttonSize}`]: true,
        [`button--${variant}`]: true,
        "button--icon-only": isIconOnly,
    });

    const iconElement = icon ? (
        <Icon
            name={icon}
            size={buttonSize}
        />
    ) : null;

    return (
        <button
            className={className}
            type={type}
            {...props}
        >
            {isIconOnly && iconElement}

            {!icon && children}

            {icon && children && iconPosition === "left" && (
                <>
                    {iconElement}
                    {children}
                </>
            )}

            {icon && children && iconPosition === "right" && (
                <>
                    {children}
                    {iconElement}
                </>
            )}
        </button>
    );
};

export default Button;
