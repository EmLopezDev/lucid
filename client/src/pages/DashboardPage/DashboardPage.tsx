import { useDashboardStats } from "./useDashboardStats";
import HeroStats from "../../components/HeroStats/HeroStats";

const DashboardPage = () => {
    const { totalGames, totalHoursPlayed, totalSpent, averageRating } = useDashboardStats();
    return (
        <div className="dashboard-page">
            <div className="dashboard-page__hero-stats">
                <HeroStats
                    iconName="gamepad"
                    statValue={totalGames}
                    text="Total Games"
                />
                <HeroStats
                    iconName="clock"
                    statValue={totalHoursPlayed}
                    text="Total Hours Played"
                />
                <HeroStats
                    iconName="dollar"
                    statValue={totalSpent}
                    text="Total Spent"
                />
                <HeroStats
                    iconName="star"
                    statValue={averageRating}
                    text="Average Rating"
                />
            </div>
        </div>
    );
};

export default DashboardPage;
