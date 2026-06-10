import { cx } from "css-variants";
import { type StatusType } from "@lucid/types";

type HoursBarProps = {
    hours: number | null;
    status?: StatusType;
    size?: "small" | "medium";
};

const SOFT_CAP = 100;
const MAX_IN_PROGRESS_PCT = 90;

const HoursBar = ({ hours, status, size = "medium" }: HoursBarProps) => {
    const isCompleted = status === "completed";
    const count = hours ?? 0;
    const pct = isCompleted
        ? 100
        : Math.min(Math.ceil(count / 10) * 10, MAX_IN_PROGRESS_PCT);
    const unit = count === 1 ? "hr" : "hrs";
    const label = count >= SOFT_CAP ? `${count}+ ${unit}` : `${count} ${unit}`;
    const statusLabel = isCompleted ? "100%" : status === "playing" ? "In Progress" : null;

    return (
        <div
            className={cx({
                "hours-bar": true,
                [`hours-bar--${size}`]: true,
                "hours-bar--completed": isCompleted,
            })}
        >
            <div className="hours-bar__track">
                <div
                    className="hours-bar__fill"
                    style={{ width: `${pct}%` }}
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${count} hours played`}
                />
            </div>
            <div className="hours-bar__info">
                <span className="hours-bar__label">{label} played</span>
                {statusLabel && <span className="hours-bar__percent">{statusLabel}</span>}
            </div>
        </div>
    );
};

export default HoursBar;
