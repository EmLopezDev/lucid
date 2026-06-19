import { useClubPageContext } from "./useClubPageContext";
import Button from "@components/Button/Button";
import Icon from "@components/Icon";

const ClubPageHeader = () => {
    const { clubData, isOwner, isMember } = useClubPageContext();

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
            </div>

            <div className="club-page__header">
                <div className="club-page__header-inner">
                    <div
                        className="club-page__avatar"
                        aria-hidden="true"
                    >
                        {clubData.avatar_url ?? "🎮"}
                    </div>

                    <div className="club-page__identity">
                        <div className="club-page__badges">
                            {isOwner && (
                                <span className="club-page__badge club-page__badge--owner">
                                    Owner
                                </span>
                            )}
                            {isMember && !isOwner && (
                                <span className="club-page__badge club-page__badge--member">
                                    Member
                                </span>
                            )}
                            {clubData.visibility === "private" && (
                                <span className="club-page__badge club-page__badge--private">
                                    <Icon
                                        name="eye-off"
                                        size="x-small"
                                    />
                                    Private
                                </span>
                            )}
                        </div>
                        <h1 className="club-page__name">{clubData.name}</h1>
                        <div className="club-page__meta">
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

                    <div className="club-page__actions">
                        {isOwner ? (
                            <>
                                <Button
                                    variant="secondary"
                                    buttonSize="small"
                                    icon="settings"
                                    iconPosition="left"
                                >
                                    Edit Club
                                </Button>
                                <Button
                                    variant="primary"
                                    buttonSize="small"
                                    icon="plus"
                                    iconPosition="left"
                                >
                                    Set Game
                                </Button>
                            </>
                        ) : isMember ? (
                            <Button
                                variant="outline"
                                buttonSize="small"
                            >
                                Leave Club
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                buttonSize="small"
                            >
                                Join Club
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClubPageHeader;
