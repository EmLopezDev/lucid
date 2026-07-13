import { cx } from "css-variants";
import { type ProfileGame } from "./hooks/useUserProfile";
import { useCoverImage } from "@hooks/useCoverImage";
import Badge from "@components/Badge";

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
                {game.status && (
                    <Badge
                        label={game.status}
                        size="small"
                    />
                )}
            </div>
        </li>
    );
};

export default ProfileGameItem;
