import type { GamingClubType } from "@lucid/types";
import { type UserType } from "@lucid/types";
import Button from "@components/Button/Button";

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
        <article className="club-card">
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
            <div className="club-card__content">
                <div className="club-card__avatar">🎮</div>
                <h3 className="club-card__name">{club.name}</h3>
                <span>{club.current_game?.title ?? "-"}</span>
                <span>{`${club.past_games.length} games completed`}</span>
                <span>{`${club.members.length} members`}</span>
                {joinButton(club.members)}
            </div>
        </article>
    );
};

export default ClubCard;
