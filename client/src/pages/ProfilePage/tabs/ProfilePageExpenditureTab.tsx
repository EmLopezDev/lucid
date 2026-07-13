import HeroStats from "@components/HeroStats";
import SpendingChart from "@components/SpendingChart";
import { useUserProfile } from "../hooks/useUserProfile";
import { useSpendingChart } from "../hooks/useSpendingChart";

const ProfilePageExpenditureTab = () => {
    const { profile } = useUserProfile();
    const { data, period, setPeriod } = useSpendingChart();

    if (!profile) return null;
    return (
        <>
            <section className="profile-page__stats">
                <HeroStats
                    iconName="dollar"
                    statValue={profile.stats.totalSpent ?? 0}
                    text="Total Spent"
                />
            </section>
            <div className="profile-page__spending-chart">
                <SpendingChart
                    data={data}
                    period={period}
                    onPeriodChange={setPeriod}
                />
            </div>
        </>
    );
};

export default ProfilePageExpenditureTab;
