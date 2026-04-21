import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";
import Badge from "../Badge/Badge";
import { capitalizeString } from "../../lib/string";
import { cx } from "css-variants";

type CardType = {
    data: UserLibraryDataType;
    selectedId: string;
    handleCardSelect: (id: string) => void;
};

const Card = ({ data, selectedId, handleCardSelect }: CardType) => {
    const className = cx({
        card: true,
        card__selected: selectedId === data._id,
    });
    return (
        <article
            className={className}
            key={data._id}
            onClick={() => handleCardSelect(data._id)}
        >
            <div className="card__banner">{data.status && <Badge status={data.status} />}</div>
            <section className="card__content">
                <h4 className="card__title">{data.title}</h4>
                <div className="card__genre">
                    <span>{data.genre}</span> &#8226; <span>{data.platform}</span>
                </div>
                <div className="card__meta">
                    <span className="card__meta--price">
                        {data.price === "Free" ? "Free" : `$${data.price}`}
                    </span>
                    <span>{capitalizeString(data.rating || "No Rating")}</span>
                </div>
            </section>
        </article>
    );
};

export default Card;
