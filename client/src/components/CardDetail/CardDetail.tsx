import { useCallback, useState } from "react";
import { type UserLibraryDataType, type PatchUserLibraryGameBodyType } from "../../../../packages/types/UserLibrary";
import { objectCopy } from "../../lib/generic";
import { type GameFormData } from "../GameFormFields/GameFormFields";
import CardDetailContent from "./CardDetailContent";
import CardDetailEditContent from "./CardDetailEditContent";
import Button from "../Button/Button";

type CardDetailType = {
    data: UserLibraryDataType;
    handleOnDeleteById: (id: string) => void;
    onPatchGame: (id: string, data: PatchUserLibraryGameBodyType) => Promise<UserLibraryDataType | null>;
    onClose: () => void;
};

const toPatchBody = (formData: GameFormData): PatchUserLibraryGameBodyType => ({
    title: formData.title,
    genre: formData.genre.value,
    platform: formData.platform.value,
    status: formData.status.value,
    price: formData.price || null,
    date_purchased: formData.datePurchased || null,
    hours_played: formData.hoursPlayed ? Number(formData.hoursPlayed) : null,
    rating: formData.rating ? Number(formData.rating) : null,
    comment: formData.comment || null,
});

const CardDetail = ({ data, handleOnDeleteById, onPatchGame, onClose }: CardDetailType) => {
    const [gameData, setGameData] = useState(objectCopy(data));
    const [editMode, setEditMode] = useState(false);

    const onSubmitEditForm = useCallback(
        async (formData: GameFormData) => {
            const updated = await onPatchGame(gameData._id, toPatchBody(formData));
            if (updated) {
                setGameData(updated);
                setEditMode(false);
            }
        },
        [gameData._id, onPatchGame],
    );

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
                <div className={`card-detail__image card-detail__image--${gameData.status}`}>IMAGE GOES HERE</div>
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
