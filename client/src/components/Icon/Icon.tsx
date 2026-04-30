import { cx } from "css-variants";
import { type IconName, iconRegistry } from "./IconMap";

type IconSize = "small" | "medium" | "large";
type IconColor = "default" | "primary" | "danger" | "muted" | "inherit";

type IconProps = {
    name: IconName;
    size?: IconSize;
    color?: IconColor;
    label?: string;
};

const sizeMap: Record<IconSize, number> = {
    small: 14,
    medium: 18,
    large: 22,
};

const Icon = ({ name, size = "medium", color = "inherit", label }: IconProps) => {
    const LucideIcon = iconRegistry[name];

    const className = cx({
        icon: true,
        [`icon--${color}`]: color !== "inherit",
    });

    return (
        <span
            className={className}
            aria-hidden={!label || undefined}
            aria-label={label}
            role={label ? "img" : undefined}
        >
            <LucideIcon size={sizeMap[size]} />
        </span>
    );
};

export default Icon;
