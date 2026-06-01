import { useState } from "react";
import { cx } from "css-variants";
import { SkeletonLoader, Skeleton } from "@components/Skeleton";
import { useUserProfile, type ProfileGame } from "./useUserProfile";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import { NavLink } from "react-router";
import Icon from "@components/Icon/Icon";
import Badge from "@components/Badge/Badge";
import { useCoverImage } from "@hooks/useCoverImage";
import { useGenreBreakdown } from "./useGenreBreakdown";
import GenreBreakdownChart from "@components/GenreBreakdownChart/GenreBreakdownChart";

type TabIdType = "stats" | "playing" | "completed" | "recent";

const tabs: { id: TabIdType; label: string }[] = [
    { id: "stats", label: "Stats" },
    { id: "playing", label: "Currently Playing" },
    { id: "completed", label: "Completed" },
    { id: "recent", label: "Recently Added" },
];

const ProfileGameItem = ({ game }: { game: ProfileGame }) => {
    const { hasImage, handleError } = useCoverImage(game.cover_url);

    return (
        <li
            className={cx({
                "profile-page__game-item": true,
                [`profile-page__game-item--${game.status}`]: !!game.status,
            })}
        >
            <div className="profile-page__game-cover">
                {hasImage && (
                    <img
                        src={game.cover_url!}
                        alt=""
                        aria-hidden="true"
                        onError={handleError}
                    />
                )}
            </div>
            <div className="profile-page__game-info">
                <span className="profile-page__game-title">{game.title}</span>
                <Badge
                    status={game.status}
                    size="small"
                />
            </div>
        </li>
    );
};

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState<TabIdType>("stats");
    const { currentUser } = useUserContext();
    const { profile, isLoading, error } = useUserProfile();
    const { data: genreData } = useGenreBreakdown();

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

            <div
                className="profile-page__tabs"
                role="tablist"
                aria-label="Profile sections"
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        className={`profile-page__tab${activeTab === tab.id ? " profile-page__tab--active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="profile-page__tab-panel">
                {activeTab === "stats" && (
                    <>
                    <section className="profile-page__stats">
                        <div className="profile-stat">
                            <Icon
                                name="gamepad"
                                size="medium"
                                color="blue"
                            />
                            <span className="profile-stat__value">{profile.stats.totalGames}</span>
                            <span className="profile-stat__label">Games</span>
                        </div>
                        <div className="profile-stat">
                            <Icon
                                name="clock"
                                size="medium"
                                color="teal"
                            />
                            <span className="profile-stat__value">
                                {profile.stats.totalHoursPlayed}
                            </span>
                            <span className="profile-stat__label">Hours Played</span>
                        </div>
                        <div className="profile-stat">
                            <Icon
                                name="check"
                                size="medium"
                                color="green"
                            />
                            <span className="profile-stat__value">
                                {profile.stats.completionRate}%
                            </span>
                            <span className="profile-stat__label">Completion Rate</span>
                        </div>
                        <div className="profile-stat">
                            <Icon
                                name="star"
                                size="medium"
                                color="gold"
                            />
                            <span className="profile-stat__value">
                                {profile.stats.averageRating ?? "—"}
                            </span>
                            <span className="profile-stat__label">Avg Rating</span>
                        </div>
                        <div className="profile-stat">
                            <Icon
                                name="tag"
                                size="medium"
                                color="orange"
                            />
                            <span className="profile-stat__value">
                                {profile.stats.favoriteGenre ?? "—"}
                            </span>
                            <span className="profile-stat__label">Fav Genre</span>
                        </div>
                    </section>
                    <div className="profile-page__genre-chart">
                        <GenreBreakdownChart data={genreData} />
                    </div>
                    </>
                )}

                {activeTab === "playing" && (
                    <section className="profile-page__section">
                        {profile.currentlyPlaying.length === 0 ? (
                            <p className="profile-page__empty">No games currently playing.</p>
                        ) : (
                            <ul className="profile-page__game-list">
                                {profile.currentlyPlaying.map((game) => (
                                    <ProfileGameItem
                                        key={game._id}
                                        game={game}
                                    />
                                ))}
                            </ul>
                        )}
                    </section>
                )}

                {activeTab === "completed" && (
                    <section className="profile-page__section">
                        {profile.completed.length === 0 ? (
                            <p className="profile-page__empty">No completed games yet.</p>
                        ) : (
                            <ul className="profile-page__game-list">
                                {profile.completed.map((game) => (
                                    <ProfileGameItem
                                        key={game._id}
                                        game={game}
                                    />
                                ))}
                            </ul>
                        )}
                    </section>
                )}

                {activeTab === "recent" && (
                    <section className="profile-page__section">
                        {profile.recentlyAdded.length === 0 ? (
                            <p className="profile-page__empty">No games added yet.</p>
                        ) : (
                            <ul className="profile-page__game-list">
                                {profile.recentlyAdded.map((game) => (
                                    <ProfileGameItem
                                        key={game._id}
                                        game={game}
                                    />
                                ))}
                            </ul>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
