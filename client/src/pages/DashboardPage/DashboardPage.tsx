import { useDashboardStats } from "./useDashboardStats";
import { useSpendingChart } from "./useSpendingChart";
import HeroStats from "../../components/HeroStats/HeroStats";
import SpendingChart from "../../components/SpendingChart/SpendingChart";

const DashboardPage = () => {
    const { totalGames, totalHoursPlayed, totalSpent, averageRating } = useDashboardStats();
    const { data, period, setPeriod } = useSpendingChart();
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
                    prefix="$"
                    statValue={totalSpent}
                    text="Total Spent"
                />
                <HeroStats
                    iconName="star"
                    statValue={averageRating}
                    text="Average Rating"
                />
            </div>
            <div className="dashboard-page__spending-chart">
                <SpendingChart
                    data={data}
                    period={period}
                    onPeriodChange={setPeriod}
                />
            </div>
        </div>
    );
};

export default DashboardPage;
