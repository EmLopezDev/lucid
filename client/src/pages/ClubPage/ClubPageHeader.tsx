import { Link } from "react-router";
import { useClubPageContext } from "./hooks/useClubPageContext";
import Button from "@components/Button/Button";
import Icon from "@components/Icon";
import useClubMembers from "./hooks/useClubMembers";
import useClubSettings from "./hooks/useClubSettings";

const ClubPageHeader = () => {
    const { clubData, isOwner, isMember } = useClubPageContext();

    const { handleOpenEditClubModal } = useClubSettings();
    const { handleJoinClub, handleOpenLeaveClubModal } = useClubMembers();

    if (!clubData) return null;

    return (
        <>
            <div className="club-page__banner">
                {clubData.current_game?.cover_url ? (
                    <img
                        className="club-page__banner-image"
                        src={clubData.current_game.cover_url}
                        alt=""
                        aria-hidden="true"
                    />
                ) : (
                    <div className="club-page__banner-gradient" />
                )}
                <div className="club-page__banner-overlay" />
                <Link
                    to="/clubs"
                    className="club-page__back-link"
                >
                    <Icon
                        name="arrow-left"
                        size="small"
                    />
                    Clubs
                </Link>
            </div>

            <div className="club-page__header">
                <div className="club-page__header-inner">
                    <div className="club-page__identity-group">
                        <div
                            className="club-page__avatar"
                            aria-hidden="true"
                        >
                            {clubData.avatar_url ?? "🎮"}
                        </div>
                        <div className="club-page__identity">
                            <div className="club-page__name-row">
                                <h1 className="club-page__name">{clubData.name}</h1>
                                <span
                                    className={`club-page__badge club-page__badge--${clubData.visibility}`}
                                >
                                    {clubData.visibility === "private" ? (
                                        <>
                                            <Icon
                                                name="eye-off"
                                                size="x-small"
                                            />
                                            Private
                                        </>
                                    ) : (
                                        "Public"
                                    )}
                                </span>
                            </div>
                            <div className="club-page__meta">
                                {clubData.current_game && (
                                    <span className="club-page__meta-item">
                                        <span
                                            className="club-page__pulse-dot"
                                            aria-hidden="true"
                                        />
                                        {clubData.current_game.title}
                                    </span>
                                )}
                                <span className="club-page__meta-item">
                                    <Icon
                                        name="users"
                                        size="small"
                                        color="muted"
                                    />
                                    {`${clubData.members.length} ${clubData.members.length === 1 ? "member" : "members"}`}
                                </span>
                                <span className="club-page__meta-item">
                                    <Icon
                                        name="activity"
                                        size="small"
                                        color="muted"
                                    />
                                    {`${clubData.past_games.length} ${clubData.past_games.length === 1 ? "game" : "games"} completed`}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="club-page__actions">
                        {isOwner ? (
                            <Button
                                variant="secondary"
                                buttonSize="medium"
                                icon="settings"
                                iconPosition="left"
                                onClick={handleOpenEditClubModal}
                            >
                                Edit Club
                            </Button>
                        ) : isMember ? (
                            <Button
                                variant="outline"
                                buttonSize="medium"
                                onClick={handleOpenLeaveClubModal}
                            >
                                Leave Club
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                buttonSize="medium"
                                onClick={handleJoinClub}
                            >
                                Join Club
                            </Button>
                        )}
                    </div>
                </div>

                {clubData.description && (
                    <p className="club-page__description club-page__description--header">
                        {clubData.description}
                    </p>
                )}
            </div>
        </>
    );
};

export default ClubPageHeader;
