import type { UserLibraryDataType } from "../../../../packages/types/UserLibrary";
import { capitalizeString } from "../../lib/string";
import Badge from "../Badge/Badge";
import Button from "../Button/Button";

type CardDetailContentType = {
    data: UserLibraryDataType;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    handleOnDeleteById: (id: string) => void;
};

const CardDetailContent = ({ data, setEditMode, handleOnDeleteById }: CardDetailContentType) => {
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
                    <span className="card-detail__grid__stat--title">Hours</span>
                    <span className="card-detail__grid__stat--hours">-</span>
                </div>
                <div className="card-detail__grid__stat">
                    <span className="card-detail__grid__stat--title">Purchased</span>
                    <span className="card-detail__grid__stat--date">
                        {(data.ownership.type === "own" &&
                            data.ownership.date_purchased?.toLocaleDateString()) ||
                            "-"}
                    </span>
                </div>
                <div className="card-detail__grid__stat">
                    <span className="card-detail__grid__stat--title">Rating</span>
                    <span className="card-detail__grid__stat--rating">
                        {data.rating || capitalizeString("no rating")}
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
                    size="small"
                    text="remove"
                    variant="danger"
                    onClick={() => handleOnDeleteById(data._id)}
                />
                <Button
                    text="edit"
                    size="small"
                    variant="secondary"
                    onClick={() => setEditMode(true)}
                />
            </div>
        </>
    );
};

export default CardDetailContent;
