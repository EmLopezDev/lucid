import { useState, useCallback, type SubmitEvent } from "react";
import Form from "../Form/Form";
import GameFormFields, { type GameFormData } from "../GameFormFields/GameFormFields";
import { type PostUserLibraryGameBodyType } from "../../../../packages/types/UserLibrary";
import { genreOptions, platformOptions, statusOptions } from "../../lib/form";

const emptyFormData: GameFormData = {
    title: "",
    genre: genreOptions[0]!,
    platform: platformOptions[0]!,
    status: statusOptions[0]!,
    price: "",
    datePurchased: "",
    hoursPlayed: "",
    rating: "",
    comment: "",
};

type AddGameFormProps = {
    onSubmit: (data: PostUserLibraryGameBodyType) => void;
    onCancel: () => void;
};

const AddGameForm = ({ onSubmit, onCancel }: AddGameFormProps) => {
    const [formData, setFormData] = useState<GameFormData>(emptyFormData);

    const handleSubmit = useCallback(
        (e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!formData.title.trim()) return;

            onSubmit({
                title: formData.title.trim(),
                genre: formData.genre.value,
                platform: formData.platform.value,
                status: formData.status.value,
                favorite: false,
                price: formData.price || null,
                date_purchased: formData.datePurchased || null,
                date_played: null,
                hours_played: formData.hoursPlayed ? Number(formData.hoursPlayed) : null,
                rating: formData.rating ? Number(formData.rating) : null,
                comment: formData.comment || null,
                cover_url: null,
            });
        },
        [formData, onSubmit],
    );

    return (
        <Form onSubmit={handleSubmit} onCancel={onCancel} primaryButtonText="Add Game">
            <GameFormFields value={formData} onChange={setFormData} />
        </Form>
    );
};

export default AddGameForm;
