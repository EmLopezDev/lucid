import Icon from "@components/Icon/Icon";
import { type IconName } from "@components/Icon/IconMap.ts";
import { useCountUp } from "../../hooks/useCountUp.ts";

type HeroStatsType = {
    iconName: IconName;
    statValue: number;
    prefix?: string;
    text: string;
};

const HeroStats = ({ iconName, statValue, prefix = "", text }: HeroStatsType) => {
    const animated = useCountUp(statValue);
    const display = Number.isInteger(statValue) ? Math.round(animated) : animated.toFixed(2);

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
                    {display}
                </span>
                <span className="hero-stat__label">{text}</span>
            </div>
        </div>
    );
};

export default HeroStats;
