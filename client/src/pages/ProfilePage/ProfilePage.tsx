import { SkeletonLoader, Skeleton } from "@components/Skeleton";
import { useUserProfile } from "./useUserProfile";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import { NavLink } from "react-router";
import Icon from "@components/Icon/Icon";

const ProfilePage = () => {
    const { currentUser } = useUserContext();
    const { profile, isLoading, error } = useUserProfile();

    if (isLoading) {
        return (
            <SkeletonLoader label="Loading profile">
                <div className="profile-page">
                    <div className="profile-page__header">
                        <div className="profile-page__header-top">
                            <Skeleton
                                height="4.5rem"
                                width="4.5rem"
                                borderRadius="50%"
                            />
                        </div>
                        <Skeleton
                            height="2rem"
                            width="14rem"
                            borderRadius="0.25rem"
                        />
                        <Skeleton
                            height="1rem"
                            width="10rem"
                            borderRadius="0.25rem"
                        />
                        <Skeleton
                            height="1rem"
                            width="8rem"
                            borderRadius="0.25rem"
                        />
                    </div>
                    <div className="profile-page__stats">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                height="5.5rem"
                                borderRadius="0.75rem"
                            />
                        ))}
                    </div>
                    <div className="profile-page__section">
                        <Skeleton
                            height="1.25rem"
                            width="10rem"
                            borderRadius="0.25rem"
                        />
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                height="4rem"
                                borderRadius="0.5rem"
                            />
                        ))}
                    </div>
                </div>
            </SkeletonLoader>
        );
    }

    if (error) return <div className="profile-page__error">{error}</div>;
    if (!profile) return null;

    return (
        <div className="profile-page">
            <section className="profile-page__header">
                <div className="profile-page__header-top">
                    <div className="profile-page__avatar">
                        {currentUser?.first_name[0]}
                        {currentUser?.last_name[0]}
                    </div>
                    <NavLink
                        className="profile-page__settings-link"
                        to="/user/settings"
                        aria-label="Account settings"
                    >
                        <Icon
                            name="settings"
                            size="medium"
                        />
                    </NavLink>
                </div>
                <h1 className="profile-page__name">
                    {profile.first_name} {profile.last_name}
                </h1>
                {profile.bio && <p className="profile-page__bio">{profile.bio}</p>}
                <div className="profile-page__meta">
                    <span>{currentUser?.email}</span>
                    <span>
                        Member since{" "}
                        {new Date(profile.created_at).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                </div>
            </section>

            <section className="profile-page__stats">
                <div className="profile-stat">
                    <span className="profile-stat__value">{profile.stats.totalGames}</span>
                    <span className="profile-stat__label">Games</span>
                </div>
                <div className="profile-stat">
                    <span className="profile-stat__value">{profile.stats.totalHoursPlayed}</span>
                    <span className="profile-stat__label">Hours Played</span>
                </div>
                <div className="profile-stat">
                    <span className="profile-stat__value">{profile.stats.completionRate}%</span>
                    <span className="profile-stat__label">Completion Rate</span>
                </div>
                <div className="profile-stat">
                    <span className="profile-stat__value">
                        {profile.stats.averageRating ?? "—"}
                    </span>
                    <span className="profile-stat__label">Avg Rating</span>
                </div>
                <div className="profile-stat">
                    <span className="profile-stat__value">
                        {profile.stats.favoriteGenre ?? "—"}
                    </span>
                    <span className="profile-stat__label">Fav Genre</span>
                </div>
            </section>

            {profile.currentlyPlaying.length > 0 && (
                <section className="profile-page__section">
                    <h2 className="profile-page__section-title">Currently Playing</h2>
                    <ul className="profile-page__game-list">
                        {profile.currentlyPlaying.map((game) => (
                            <li
                                key={game._id}
                                className="profile-page__game-item"
                            >
                                {game.title}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {profile.completed.length > 0 && (
                <section className="profile-page__section">
                    <h2 className="profile-page__section-title">Completed</h2>
                    <ul className="profile-page__game-list">
                        {profile.completed.map((game) => (
                            <li
                                key={game._id}
                                className="profile-page__game-item"
                            >
                                {game.title}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {profile.recentlyAdded.length > 0 && (
                <section className="profile-page__section">
                    <h2 className="profile-page__section-title">Recently Added</h2>
                    <ul className="profile-page__game-list">
                        {profile.recentlyAdded.map((game) => (
                            <li
                                key={game._id}
                                className="profile-page__game-item"
                            >
                                {game.title}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
};

export default ProfilePage;
