import { useId } from "react";
import { cx } from "css-variants";

type StarRatingProps = {
    rating: number | null;
    size?: "small" | "medium" | "large";
    showValue?: boolean;
};

type StarIconProps = {
    fillPercentage: number;
    gradientId: string;
};

const StarIcon = ({ fillPercentage, gradientId }: StarIconProps) => (
    <svg
        className="star-rating__star"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <defs>
            <linearGradient
                id={gradientId}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
            >
                <stop
                    offset={`${fillPercentage * 100}%`}
                    stopColor="var(--color-star)"
                />
                <stop
                    offset={`${fillPercentage * 100}%`}
                    stopColor={`rgba(var(--color-star-rgb), 0.15)`}
                />
            </linearGradient>
        </defs>
        <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26Z"
            fill={`url(#${gradientId})`}
        />
    </svg>
);

const StarRating = ({ rating, size = "medium", showValue = false }: StarRatingProps) => {
    const baseId = useId();

    if (!rating) return "No Rating";

    const clamped = Math.min(Math.max(rating, 0), 5);

    return (
        <div
            className={cx({
                "star-rating": true,
                [`star-rating--${size}`]: true,
            })}
            role="img"
            aria-label={`${clamped.toFixed(1)} out of 5 stars`}
        >
            <div
                className="star-rating__stars"
                aria-hidden="true"
            >
                {Array.from({ length: 5 }, (_, i) => (
                    <StarIcon
                        key={i}
                        fillPercentage={Math.min(Math.max(clamped - i, 0), 1)}
                        gradientId={`${baseId}-star-${i}`}
                    />
                ))}
            </div>
            {showValue && (
                <span
                    className="star-rating__value"
                    aria-hidden="true"
                >
                    {clamped.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default StarRating;
