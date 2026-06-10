import { useState, useCallback, type SubmitEvent } from "react";
import Form from "@components/Form";
import GameFormFields, { type GameFormData } from "@components/GameFormFields";
import { type UserLibraryDataType } from "@lucid/types";
import { toInputDate } from "@lib/date";

type CardDetailEditContentProps = {
    data: UserLibraryDataType;
    onSubmit: (data: GameFormData) => void;
    onCancel: () => void;
};

const toFormData = (data: UserLibraryDataType): GameFormData => ({
    title: data.title,
    genre: data.genre
        ? { value: data.genre, label: data.genre }
        : { value: null, label: "Not set" },
    platform: data.platform
        ? { value: data.platform, label: data.platform }
        : { value: null, label: "Not set" },
    status: data.status
        ? { value: data.status, label: data.status }
        : { value: null, label: "Not set" },
    price: data.price ?? "",
    datePurchased: data.date_purchased ? toInputDate(data.date_purchased) : "",
    hoursPlayed: String(data.hours_played ?? ""),
    rating: String(data.rating ?? ""),
    comment: data.comment ?? "",
});

const CardDetailEditContent = ({ data, onSubmit, onCancel }: CardDetailEditContentProps) => {
    const [formData, setFormData] = useState<GameFormData>(() => toFormData(data));

    const handleSubmit = useCallback(
        (e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            onSubmit(formData);
        },
        [formData, onSubmit],
    );

    return (
        <Form
            buttonSize="small"
            onSubmit={handleSubmit}
            onCancel={onCancel}
        >
            <GameFormFields
                inputSize="small"
                value={formData}
                onChange={setFormData}
            />
        </Form>
    );
};

export default CardDetailEditContent;
