import { NavLink } from "react-router";
import { useDashboardStats } from "./useDashboardStats";
import { useSpendingChart } from "./useSpendingChart";
import { useUserLibraryContext } from "../../contexts/UserLibraryContext/useUserLibraryContext";
import { useStatusBreakdown } from "./useStatusBreakdown";
import { SkeletonLoader, Skeleton } from "../../components/Skeleton";
import HeroStats from "../../components/HeroStats/HeroStats";
import SpendingChart from "../../components/SpendingChart/SpendingChart";
import Icon from "../../components/Icon/Icon";
import StatusBreakdownChart from "../../components/StatusBreakdownChart/StatusBreakdownChart";

const DashboardPage = () => {
    const { isLoading, libraryData } = useUserLibraryContext();
    const { totalGames, totalHoursPlayed, totalSpent, averageRating } = useDashboardStats();
    const { data, period, setPeriod } = useSpendingChart();
    const { data: statusData } = useStatusBreakdown();
    return (
        <div className="dashboard-page">
            {isLoading ? (
                <>
                    <SkeletonLoader label="Loading your library">
                        <div className="dashboard-page__hero-stats">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="hero-stat__skeleton"
                                >
                                    <Skeleton height="5.4rem" />
                                </div>
                            ))}
                        </div>
                    </SkeletonLoader>
                    <SkeletonLoader>
                        <div className="dashboard-page__spending-chart">
                            <Skeleton
                                height="20rem"
                                borderRadius="0.75rem"
                            />
                        </div>
                    </SkeletonLoader>
                </>
            ) : !libraryData.length ? (
                <div className="dashboard-page__empty">
                    <span className="dashboard-page__empty-icon">
                        <Icon
                            size="x-large"
                            name="library"
                        />
                    </span>
                    <p className="dashboard-page__empty-text">No games in your library yet.</p>
                    <NavLink
                        className="dashboard-page__empty-link"
                        to="/user/library"
                    >
                        Go to Library
                        <Icon
                            size="large"
                            name="arrow-right"
                        />
                    </NavLink>
                </div>
            ) : (
                <>
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
                    <SpendingChart
                        data={data}
                        period={period}
                        onPeriodChange={setPeriod}
                    />
                    <StatusBreakdownChart data={statusData} />
                </>
            )}
        </div>
    );
};

export default DashboardPage;
