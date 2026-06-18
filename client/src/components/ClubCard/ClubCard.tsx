import { Link } from "react-router";
import { type GamingClubType, type UserType } from "@lucid/types";
import Button from "@components/Button/Button";
import Icon from "@components/Icon";

type ClubCardType = {
    club: GamingClubType;
    currentUser: UserType | null;
    onJoinClub: (clubId: string) => Promise<boolean>;
    onLeaveClub: (clubId: string) => Promise<boolean>;
};

const ClubCard = ({ club, currentUser, onJoinClub, onLeaveClub }: ClubCardType) => {
    const joinButton =
        currentUser && club.members.includes(currentUser._id) ? (
            <Button
                className="club-card__join-button"
                icon="check"
                iconPosition="left"
                buttonSize="small"
                variant="success"
                onClick={() => onLeaveClub(club._id)}
            >
                Joined
            </Button>
        ) : (
            <Button
                className="club-card__join-button"
                variant="outline"
                buttonSize="small"
                onClick={() => onJoinClub(club._id)}
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
                    {club.avatar_url ?? "🎮"}
                </div>
            </div>
            <div className="club-card__content">
                <h3 className="club-card__name">
                    <Link
                        className="club-card__link"
                        to={`/clubs/${club._id}`}
                    >
                        {club.name}
                    </Link>
                </h3>
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
