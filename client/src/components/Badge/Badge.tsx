import { cx } from "css-variants";
import { capitalizeString } from "@lib/string";

type BadgeType = {
    label: string;
    size?: "small" | "medium" | "large";
};

const Badge = ({ label, size = "small" }: BadgeType) => {
    const capLabel = capitalizeString(label);
    const className = cx({
        badge: true,
        [`badge--${size}`]: true,
        [`badge__${label.toLowerCase()}`]: true,
    });
    return (
        <span
            className={className}
            aria-label={capLabel}
        >
            {capLabel}
        </span>
    );
};

export default Badge;
