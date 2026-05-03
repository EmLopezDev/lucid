import { cx } from "css-variants";
import { capitalizeString } from "../../lib/string";
import { type StatusType } from "../../../../packages/types";

type BadgeType = {
    status: StatusType;
    size?: "small" | "medium" | "large";
};

const Badge = ({ status, size = "small" }: BadgeType) => {
    const label = capitalizeString(status);
    const className = cx({
        badge: true,
        [`badge--${size}`]: true,
        [`badge__${status}`]: true,
    });
    return (
        <span
            className={className}
            aria-label={`Status: ${label}`}
        >
            {label}
        </span>
    );
};

export default Badge;
