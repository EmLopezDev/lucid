import { type UserLibraryDataType } from "@lucid/types";
import Badge from "@components/Badge";
import HoursBar from "@components/HoursBar";
import Icon from "@components/Icon";
import { cx } from "css-variants";
import StarRating from "@components/StarRating";
import { capitalizeString } from "@lib/string";
import { useCoverImage } from "@hooks/useCoverImage";

type CardType = {
    data: UserLibraryDataType;
    selectedId: string;
    handleCardSelect: (id: string) => void;
    handleDelete: (id: string) => void;
};

const Card = ({ data, selectedId, handleCardSelect, handleDelete }: CardType) => {
    const { hasImage, handleError } = useCoverImage(data.cover_url);
    const isSelected = selectedId === data._id;
    return (
        <div className={cx({ card: true, card__selected: isSelected })}>
            <button
                type="button"
                className="card__select"
                onClick={() => handleCardSelect(data._id)}
                aria-pressed={isSelected}
                aria-label={`${data.title}, ${capitalizeString(data.status ?? "")}, ${capitalizeString(data.genre ?? "")}, ${capitalizeString(data.platform ?? "")}`}
            >
                <div
                    className={cx({
                        card__banner: true,
                        [`card__banner--${data.status}`]: !!data.status,
                        "card__banner--has-image": hasImage,
                    })}
                >
                    {hasImage && (
                        <img
                            className="card__banner-img"
                            src={data.cover_url!}
                            alt=""
                            aria-hidden="true"
                            onError={handleError}
                        />
                    )}
                    {data.status && <Badge size="medium" label={data.status} />}
                </div>
                <div className="card__content">
                    <h4 className="card__title">{data.title}</h4>
                    <div className="card__genre">
                        <span>{data.genre ? capitalizeString(data.genre) : "-"}</span> &#8226;{" "}
                        <span>{data.platform ? capitalizeString(data.platform) : "-"}</span>
                    </div>
                    <div className="card__meta">
                        {data.price !== null && (
                            <span className="card__meta--price">
                                {data.price === "0.00" ? "Free" : `$${data.price}`}
                            </span>
                        )}
                        <StarRating
                            size="small"
                            rating={data.rating}
                        />
                    </div>
                </div>
                <div className="card__hours">
                    <HoursBar
                        hours={data.hours_played}
                        status={data.status}
                        size="small"
                    />
                </div>
            </button>
            <button
                type="button"
                className="card__delete"
                onClick={() => handleDelete(data._id)}
                aria-label={`Delete ${data.title}`}
            >
                <Icon
                    name="trash"
                    size="small"
                />
            </button>
        </div>
    );
};

export default Card;
