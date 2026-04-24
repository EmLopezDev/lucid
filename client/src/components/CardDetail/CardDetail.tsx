import { useState } from "react";
import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";
import CardDetailContent from "./CardDetailContent";
import CardDetailEditContent from "./CardDetailEditContent";

type CardDetailType = {
    data: UserLibraryDataType;
    handleOnDeleteById: (id: string) => void;
};

const CardDetail = ({ data, handleOnDeleteById }: CardDetailType) => {
    const [editMode, setEditMode] = useState(false);
    return (
        <aside className="card-detail__container">
            <div className="card-detail">
                <div className="card-detail__image">IMAGE GOES HERE</div>
                <div className="card-detail__content">
                    {editMode ? (
                        <CardDetailEditContent data={data} />
                    ) : (
                        <CardDetailContent
                            data={data}
                            setEditMode={setEditMode}
                            handleOnDeleteById={handleOnDeleteById}
                        />
                    )}
                </div>
            </div>
        </aside>
    );
};

export default CardDetail;
