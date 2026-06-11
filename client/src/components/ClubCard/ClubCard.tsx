import { type GamingClubType, type UserType } from "@lucid/types";
import Button from "@components/Button/Button";
import Icon from "@components/Icon";

type ClubCardType = {
    club: GamingClubType;
    currentUser: UserType | null;
};

const ClubCard = ({ club, currentUser }: ClubCardType) => {
    const joinButton =
        currentUser && club.members.includes(currentUser._id) ? (
            <Button
                icon="check"
                iconPosition="left"
                buttonSize="small"
                variant="success"
            >
                Joined
            </Button>
        ) : (
            <Button
                variant="outline"
                buttonSize="small"
            >
                Join
            </Button>
        );

    return (
        <article
            className="club-card"
            aria-label={`${club.name} club`}
        >
            <div className="club-card__banner">
                {club.current_game?.cover_url ? (
                    <img
                        className="club-card__image"
                        src={club.current_game?.cover_url}
                        alt=""
                    />
                ) : (
                    <div className="club-card__gradient"></div>
                )}
            </div>
            <div className="club-card__header">
                <div
                    className="club-card__avatar"
                    aria-hidden="true"
                >
                    🎮
                </div>
            </div>
            <div className="club-card__content">
                <h3 className="club-card__name">{club.name}</h3>
                <div className="club-card__stats">
                    <div className="club-card__stat">
                        {club.current_game ? (
                            <>
                                <span className="club-card__pulse-dot"></span>
                                <span>{club.current_game.title}</span>
                            </>
                        ) : (
                            <>
                                <Icon
                                    name="loader"
                                    size="small"
                                    color="muted"
                                />
                                <span className="club-card__no-game">No game set</span>
                            </>
                        )}
                    </div>
                    <div className="club-card__stat">
                        <Icon
                            name="activity"
                            size="small"
                            color="muted"
                        />
                        <span>{`${club.past_games.length} ${club.past_games.length === 1 ? "game" : "games"} completed`}</span>
                    </div>
                    <div className="club-card__stat">
                        <Icon
                            name="users"
                            size="small"
                            color="muted"
                        />
                        <span>{`${club.members.length} ${club.members.length === 1 ? "member" : "members"}`}</span>
                    </div>
                </div>
                {joinButton}
            </div>
        </article>
    );
};

export default ClubCard;
