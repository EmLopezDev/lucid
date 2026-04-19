import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";
import Badge from "../Badge/Badge";

type CardType = {
    data: UserLibraryDataType;
};

const Card = ({ data }: CardType) => {
    return (
        <article
            className="card"
            key={data._id}
        >
            <div className="card__banner">{data.status && <Badge status={data.status} />}</div>
            <section className="card__content">
                <h4 className="card__title">{data.title}</h4>
                <div className="card__genre">
                    <span>{data.genre}</span> &#8226; <span>{data.platform}</span>
                </div>
                <div className="card__meta">
                    <span>{data.ownership.type === "own" && data.ownership.purchase_amount}</span>
                    <span>{data.rating || "No Rating"}</span>
                </div>
                <span className="card__status">{data.status || "No Status"}</span>
            </section>
        </article>
    );
};

export default Card;
