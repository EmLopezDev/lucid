import { useDashboardStats } from "./useDashboardStats";

const DashboardPage = () => {
    const { totalGames, totalHoursPlayed, totalSpent, averageRating } = useDashboardStats();
    return (
        <div className="dashboard-page">
            <div>
                <h3>Total Games: {totalGames}</h3>
                <h3>Total Hours Played: {totalHoursPlayed}hrs</h3>
                <h3>Total Dollars Spent: ${totalSpent}</h3>
                <h3>Average Rating: {averageRating}</h3>
            </div>
        </div>
    );
};

export default DashboardPage;
