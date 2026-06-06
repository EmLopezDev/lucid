import { NavLink } from "react-router";
import { type UserLibraryDataType } from "@lucid/types";
import Badge from "@components/Badge/Badge";
import { capitalizeString } from "@lib/string";
import { cx } from "css-variants";
import { useCoverImage } from "@hooks/useCoverImage";

type RecentGameCardProps = {
    game: UserLibraryDataType;
};

const RecentGameCard = ({ game }: RecentGameCardProps) => {
    const { hasImage, handleError } = useCoverImage(game.cover_url);

    return (
        <NavLink
            to="/user/library"
            className={cx({
                "recent-game-card": true,
                [`recent-game-card--${game.status}`]: !!game.status,
            })}
            aria-label={`${game.title}${game.status ? `, ${capitalizeString(game.status)}` : ""}`}
        >
            <div className="recent-game-card__cover">
                {hasImage && (
                    <img
                        src={game.cover_url!}
                        alt=""
                        aria-hidden="true"
                        onError={handleError}
                    />
                )}
            </div>
            <div className="recent-game-card__info">
                <span className="recent-game-card__title">{game.title}</span>
                <div className="recent-game-card__meta">
                    {game.status && <Badge size="small" label={game.status} />}
                    {game.platform && (
                        <span className="recent-game-card__platform">
                            {capitalizeString(game.platform)}
                        </span>
                    )}
                </div>
            </div>
        </NavLink>
    );
};

type RecentGamesProps = {
    games: UserLibraryDataType[];
};

const RecentGames = ({ games }: RecentGamesProps) => {
    if (!games.length) return null;

    return (
        <div className="recent-games">
            <h2 className="recent-games__title">Recently Added</h2>
            <div className="recent-games__list">
                {games.map((game) => (
                    <RecentGameCard
                        key={game._id}
                        game={game}
                    />
                ))}
            </div>
        </div>
    );
};

export default RecentGames;
