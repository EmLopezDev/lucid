import Icon from "../Icon/Icon";
import { cx } from "css-variants";
import { type IconName } from "../../components/Icon/IconMap.ts";

type HeroStatsType = {
    iconName: IconName;
    statValue: number;
    text: string;
};

const HeroStats = ({ iconName, statValue, text }: HeroStatsType) => {
    return (
        <div className="hero-stat">
            <span
                className={cx({
                    "hero-stat__icon": true,
                    [`hero-stat__icon--${iconName}`]: iconName,
                })}
            >
                <Icon
                    size="large"
                    name={iconName}
                />
            </span>
            <div className="hero-stat__data">
                <span
                    className={cx({
                        "hero-stat__data__value": true,
                        [`hero-stat__data__value--${iconName}`]: iconName,
                    })}
                >
                    {statValue}
                </span>
                <span className="hero-stat__data__text">{text}</span>
            </div>
        </div>
    );
};

export default HeroStats;
