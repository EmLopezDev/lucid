import GenreBreakdownChart from "@components/GenreBreakdownChart";
import HeroStats from "@components/HeroStats";
import StatusBreakdownChart from "@components/StatusBreakdownChart";
import { useUserProfile } from "../hooks/useUserProfile";
import { useGenreBreakdown } from "../hooks/useGenreBreakdown";
import { useStatusBreakdown } from "../hooks/useStatusBreakdown";

const ProfilePageStatsTab = () => {
    const { profile } = useUserProfile();
    const { data: genreData } = useGenreBreakdown();
    const { data: statusData } = useStatusBreakdown();

    if (!profile) return null;
    return (
        <>
            <section className="profile-page__stats">
                <HeroStats
                    iconName="gamepad"
                    statValue={profile.stats.totalGames}
                    text="Games"
                />
                <HeroStats
                    iconName="clock"
                    statValue={profile.stats.totalHoursPlayed}
                    text="Hours Played"
                />
                <HeroStats
                    iconName="check"
                    statValue={profile.stats.completionRate}
                    text="Completion Rate"
                />
                <HeroStats
                    iconName="star"
                    statValue={profile.stats.averageRating ?? 0}
                    text="Avg Rating"
                />
                <HeroStats
                    iconName="tag"
                    statValue={profile.stats.mostPlayedGenre ?? "-"}
                    text="Most Played Genre"
                />
            </section>
            <div className="profile-page__charts">
                <GenreBreakdownChart data={genreData} />
                <StatusBreakdownChart data={statusData} />
            </div>
        </>
    );
};

export default ProfilePageStatsTab;
