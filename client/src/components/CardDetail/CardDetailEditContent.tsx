import { useCallback, useState, type SubmitEvent } from "react";
import Form from "../Form/Form";
import Input from "../Input/Input";
import Select from "../Select/Select";
import DatePicker from "../DatePicker/DatePicker";
import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";
import {
    type PlatformType,
    type StatusType,
    type GenreType,
    type PlatformOptionType,
    type StatusOptionType,
    type GenreOptionType,
} from "../../../../packages/types";
import { platformOptions, statusOptions, genreOptions } from "../../lib/form";
import Textarea from "../Textarea/Textarea";

type CardDetailEditContent = {
    data: UserLibraryDataType;
    onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
    onCancel: () => void;
};

type EditFormDataType = {
    title?: string;
    platform?: PlatformOptionType;
    genre?: GenreOptionType;
    status?: StatusOptionType;
    price?: string;
    date_purchased?: string;
    hours?: number;
    rating?: number;
    comment?: string;
};

const CardDetailEditContent = ({ data, onSubmit, onCancel }: CardDetailEditContent) => {
    const [formData, setFormData] = useState<EditFormDataType | null>(null);
    const [status, setStatus] = useState<Omit<StatusOptionType, "all">>({
        value: data.status,
        label: data.status,
    });
    const [platform, setPlatform] = useState<PlatformOptionType>({
        value: data.platform,
        label: data.platform,
    });
    const [genre, setGenre] = useState<GenreOptionType>({
        value: data.genre,
        label: data.genre,
    });

    const datePurchased = data.date_purchased ? data.date_purchased : "";

    const onStatusSelect = useCallback((option: StatusOptionType) => {
        setStatus(option);
        setFormData((prevState) => ({ ...prevState, status: option }));
    }, []);

    const onPlatformSelect = useCallback((option: PlatformOptionType) => {
        setPlatform(option);
        setFormData((prevState) => ({ ...prevState, platform: option }));
    }, []);

    const onGenreSelect = useCallback((option: GenreOptionType) => {
        setGenre(option);
        setFormData((prevState) => ({ ...prevState, genre: option }));
    }, []);

    const handleOnSubmit = useCallback(
        (e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!formData) return;
            onSubmit(e);
        },
        [formData, onSubmit],
    );
    return (
        <>
            <Form
                buttonSize="small"
                onSubmit={handleOnSubmit}
                onCancel={onCancel}
            >
                <div className="card-detail__content__edit">
                    <div className="card-detail__content__edit--full">
                        <Input
                            id="title-input"
                            value={data.title}
                            onChange={() => {}}
                            label="Title"
                            inputSize="small"
                            hasErrorText={false}
                            placeholder="eg. Mario Party"
                        />
                    </div>
                    <div className="card-detail__content__edit--full">
                        <Select<GenreType, GenreType>
                            id="genre-select"
                            options={genreOptions}
                            value={genre.value}
                            onChange={onGenreSelect}
                            selectSize="small"
                        />
                    </div>
                    <Select<PlatformType, PlatformType>
                        id="platform-select"
                        options={platformOptions}
                        value={platform.value}
                        onChange={onPlatformSelect}
                        selectSize="small"
                    />
                    <Select<StatusType, StatusType>
                        id="status-select"
                        options={statusOptions}
                        value={status.value}
                        onChange={onStatusSelect}
                        selectSize="small"
                    />
                    <Input
                        id="price-input"
                        label="Price"
                        type="number"
                        onChange={() => {}}
                        inputSize="small"
                        hasErrorText={false}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                    />
                    <DatePicker
                        label="Purchase Date"
                        value={datePurchased}
                        onChange={(date) =>
                            setFormData((prev) => ({ ...prev, date_purchased: date }))
                        }
                        inputSize="small"
                    />
                    <Input
                        id="hours-input"
                        label="Hours"
                        type="number"
                        value={data.hours_played ?? 0}
                        onChange={() => {}}
                        inputSize="small"
                        hasErrorText={false}
                        min="0"
                        step="1"
                    />
                    <Input
                        id="rating-input"
                        label="Rating"
                        type="number"
                        onChange={() => {}}
                        inputSize="small"
                        hasErrorText={false}
                        min="0"
                        max="5"
                        step="0.25"
                        placeholder="0-5"
                    />
                </div>
                <Textarea
                    id="comment-input"
                    label="Comment"
                    onChange={() => {}}
                />
            </Form>
        </>
    );
};

export default CardDetailEditContent;
