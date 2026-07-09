import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "css-variants";
import Icon from "@components/Icon";
import { type IconName } from "@components/Icon";

type ButtonBase = {
    type?: "submit" | "button" | "reset";
    variant?: "primary" | "secondary" | "danger" | "success" | "transparent" | "outline";
    buttonSize?: "x-small" | "small" | "medium" | "large";
    isLoading?: boolean;
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
    className: externalClassName,
    isLoading = false,
    disabled,
    ...props
}: ButtonProps) => {
    const isIconOnly = !!icon && !children;

    const className = cx({
        button: true,
        [`button--${buttonSize}`]: true,
        [`button--${variant}`]: true,
        "button--icon-only": isIconOnly,
    });

    const contentClassName = cx({
        button__content: true,
        "button__content--hidden": isLoading,
    });

    const iconElement = icon ? (
        <Icon
            name={icon}
            size={buttonSize}
        />
    ) : null;

    return (
        <button
            className={[className, externalClassName].filter(Boolean).join(" ")}
            type={type}
            disabled={disabled || isLoading}
            aria-busy={isLoading}
            {...props}
        >
            <span className={contentClassName}>
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
            </span>
            {isLoading && (
                <span
                    className="button__spinner"
                    aria-hidden="true"
                />
            )}
        </button>
    );
};

export default Button;
