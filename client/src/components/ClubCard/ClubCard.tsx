import type { GamingClubType } from "@lucid/types";
import { type UserType } from "@lucid/types";
import Button from "@components/Button/Button";
import Icon from "@components/Icon";

type ClubCardType = {
    club: GamingClubType;
    currentUser: UserType | null;
};

const ClubCard = ({ club, currentUser }: ClubCardType) => {
    const joinButton = (members: string[]) => {
        if (currentUser && members.includes(currentUser._id)) {
            return (
                <Button
                    icon="check"
                    iconPosition="left"
                    buttonSize="small"
                >
                    Joined
                </Button>
            );
        } else {
            return <Button buttonSize="small">Join</Button>;
        }
    };

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
                                <span className="club-card__current-game__none">No game set</span>
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
                {joinButton(club.members)}
            </div>
        </article>
    );
};

export default ClubCard;
