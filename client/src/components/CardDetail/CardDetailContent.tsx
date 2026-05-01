import type { UserLibraryDataType } from "../../../../packages/types/UserLibrary";
import Badge from "../Badge/Badge";
import Button from "../Button/Button";
import StarRating from "../StarRating/StarRating";
import { formatDate } from "../../lib/date";

type CardDetailContentType = {
    data: UserLibraryDataType;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    handleOnDeleteById: (id: string) => void;
};

const CardDetailContent = ({ data, setEditMode, handleOnDeleteById }: CardDetailContentType) => {
    const datePurchased = data.date_purchased ? formatDate(data.date_purchased) : "-";
    return (
        <>
            <span className="card-detail__content__title">{data.title}</span>
            <div className="card-detail__content__genre">
                <span>{data.genre}</span> &#8226; <span>{data.platform}</span>
            </div>
            <div className="card-detail__content__status">
                <Badge status={data.status} />
            </div>
            <div className="card-detail__grid">
                <div className="card-detail__grid__stat">
                    <span className="card-detail__grid__stat--title">Price</span>
                    <span className="card-detail__grid__stat--price">
                        {data.price === "Free" ? "Free" : `$${data.price}`}
                    </span>
                </div>
                <div className="card-detail__grid__stat">
                    <span className="card-detail__grid__stat--title">Purchased</span>
                    <span className="card-detail__grid__stat--date">{datePurchased}</span>
                </div>
                <div className="card-detail__grid__stat">
                    <span className="card-detail__grid__stat--title">Hours</span>
                    <span className="card-detail__grid__stat--hours">
                        {data.hours_played ?? "-"}
                    </span>
                </div>
                <div className="card-detail__grid__stat">
                    <span className="card-detail__grid__stat--title">Rating</span>
                    <span className="card-detail__grid__stat--rating">
                        <StarRating
                            rating={data.rating}
                            showValue
                        />
                    </span>
                </div>
            </div>
            <div className="card-detail__comment">
                <span className="card-detail__comment--title">Comments</span>
                <div className="card-detail__comment--text">
                    {data.comment ? data.comment : "No comments added yet."}
                </div>
            </div>
            <div className="card-detail__buttons">
                <Button
                    buttonSize="small"
                    variant="danger"
                    onClick={() => handleOnDeleteById(data._id)}
                >
                    Remove
                </Button>
                <Button
                    buttonSize="small"
                    variant="secondary"
                    onClick={() => setEditMode(true)}
                >
                    Edit
                </Button>
            </div>
        </>
    );
};

export default CardDetailContent;
