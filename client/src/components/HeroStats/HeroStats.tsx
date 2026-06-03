import Icon from "@components/Icon/Icon";
import { type IconName } from "@components/Icon/IconMap.ts";
import { useCountUp } from "@hooks/useCountUp.ts";
import { capitalizeString } from "@lib/string";

type HeroStatsType = {
    iconName: IconName;
    statValue: number | string;
    prefix?: string;
    text: string;
};

const HeroStats = ({ iconName, statValue, prefix = "", text }: HeroStatsType) => {
    const animated = useCountUp(typeof statValue === "number" ? statValue : 0);
    const displayValue =
        typeof statValue === "number"
            ? Number.isInteger(statValue)
                ? Math.round(animated)
                : animated.toFixed(2)
            : capitalizeString(statValue);

    return (
        <div className={`hero-stat hero-stat--${iconName}`}>
            <div className={`hero-stat__icon hero-stat__icon--${iconName}`}>
                <Icon
                    size="large"
                    name={iconName}
                />
            </div>
            <div className="hero-stat__data">
                <span className={`hero-stat__value hero-stat__value--${iconName}`}>
                    {prefix}
                    {displayValue}
                </span>
                <span className="hero-stat__label">{text}</span>
            </div>
        </div>
    );
};

export default HeroStats;
