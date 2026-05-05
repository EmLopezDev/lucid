import { cx } from "css-variants";
import { type StatusType } from "../../../../packages/types";

type HoursBarProps = {
    hours: number | null;
    status?: StatusType;
    size?: "small" | "medium";
};

const SOFT_CAP = 100;

const HoursBar = ({ hours, status, size = "medium" }: HoursBarProps) => {
    const isCompleted = status === "completed";
    const count = hours ?? 0;
    const pct = isCompleted ? 100 : Math.min(Math.round((count / SOFT_CAP) * 100), 100);
    const unit = count === 1 ? "hr" : "hrs";
    const label = count >= SOFT_CAP ? `${count}+ ${unit}` : `${count} ${unit}`;

    return (
        <div
            className={cx({
                "hours-bar": true,
                [`hours-bar--${size}`]: true,
                "hours-bar--completed": isCompleted,
            })}
        >
            <div className="hours-bar__info">
                <span className="hours-bar__label">{label} played</span>
                <span className="hours-bar__percent">{pct}%</span>
            </div>
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
        </div>
    );
};

export default HoursBar;
