import { useState, useCallback, type SubmitEvent } from "react";
import Form from "../Form/Form";
import GameFormFields, { type GameFormData } from "../GameFormFields/GameFormFields";
import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";

type CardDetailEditContentProps = {
    data: UserLibraryDataType;
    onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
    onCancel: () => void;
};

const toFormData = (data: UserLibraryDataType): GameFormData => ({
    title: data.title,
    genre: { value: data.genre, label: data.genre },
    platform: { value: data.platform, label: data.platform },
    status: { value: data.status, label: data.status },
    price: data.price ?? "",
    datePurchased: data.date_purchased ?? "",
    hoursPlayed: String(data.hours_played ?? ""),
    rating: String(data.rating ?? ""),
    comment: data.comment ?? "",
});

const CardDetailEditContent = ({ data, onSubmit, onCancel }: CardDetailEditContentProps) => {
    const [formData, setFormData] = useState<GameFormData>(() => toFormData(data));

    const handleSubmit = useCallback(
        (e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            onSubmit(e);
        },
        [onSubmit],
    );

    return (
        <Form buttonSize="small" onSubmit={handleSubmit} onCancel={onCancel}>
            <GameFormFields value={formData} onChange={setFormData} />
        </Form>
    );
};

export default CardDetailEditContent;
