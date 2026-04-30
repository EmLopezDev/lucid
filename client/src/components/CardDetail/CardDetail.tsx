import { useCallback, useState } from "react";
import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";
import { objectCopy } from "../../lib/generic";
import CardDetailContent from "./CardDetailContent";
import CardDetailEditContent from "./CardDetailEditContent";
import Button from "../Button/Button";

type CardDetailType = {
    data: UserLibraryDataType;
    handleOnDeleteById: (id: string) => void;
    onClose: () => void;
};

const CardDetail = ({ data, handleOnDeleteById, onClose }: CardDetailType) => {
    const [gameData, setGameData] = useState(objectCopy(data));
    const [editMode, setEditMode] = useState(false);

    const onSubmitEditForm = useCallback(() => {
        setEditMode(false);
    }, []);

    const onCancelEditMode = useCallback(() => {
        setEditMode(false);
        setGameData(data);
    }, [data]);

    const handleCloseCardDetail = useCallback(() => {
        onClose();
        setEditMode(false);
    }, [onClose]);

    return (
        <aside className="card-detail__container">
            <div className="card-detail">
                <span className="card-detail__button--close">
                    <Button
                        icon="close"
                        aria-label="close card detail"
                        variant="transparent"
                        buttonSize="small"
                        onClick={handleCloseCardDetail}
                    />
                </span>
                <div className="card-detail__image">IMAGE GOES HERE</div>
                <div className="card-detail__content">
                    {editMode ? (
                        <CardDetailEditContent
                            data={gameData}
                            onSubmit={onSubmitEditForm}
                            onCancel={onCancelEditMode}
                        />
                    ) : (
                        <CardDetailContent
                            data={gameData}
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
