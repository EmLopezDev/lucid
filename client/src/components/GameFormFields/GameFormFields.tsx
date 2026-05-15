import Input from "@components/Input/Input";
import Select from "@components/Select/Select";
import DatePicker from "@components/DatePicker/DatePicker";
import Textarea from "@components/Textarea/Textarea";
import {
    type GenreType,
    type PlatformType,
    type StatusType,
    type GenreOptionType,
    type PlatformOptionType,
    type StatusOptionType,
} from "../../../../packages/types";
import { genreOptions, platformOptions, statusOptions } from "@lib/form";

export type GameFormData = {
    title: string;
    genre: GenreOptionType;
    platform: PlatformOptionType;
    status: StatusOptionType;
    price: string;
    datePurchased: string;
    hoursPlayed: string;
    rating: string;
    comment: string;
};

type GameFormFieldsProps = {
    value: GameFormData;
    inputSize?: "small" | "medium" | "large";
    onChange: (data: GameFormData) => void;
};

const GameFormFields = ({ value, inputSize = "medium", onChange }: GameFormFieldsProps) => {
    const update = (patch: Partial<GameFormData>) => onChange({ ...value, ...patch });

    return (
        <>
            <div className="card-detail__content__edit">
                <div className="card-detail__content__edit--full">
                    <Input
                        id="title-input"
                        label="Title"
                        value={value.title}
                        onChange={(e) => update({ title: e.target.value })}
                        inputSize={inputSize}
                        hasErrorText={false}
                        placeholder="eg. Mario Party"
                    />
                </div>
                <div className="card-detail__content__edit--full">
                    <Select<GenreType, GenreType>
                        id="genre-select"
                        label="Genre"
                        options={genreOptions}
                        value={value.genre.value}
                        onChange={(option) => update({ genre: option })}
                        selectSize={inputSize}
                    />
                </div>
                <Select<PlatformType, PlatformType>
                    id="platform-select"
                    label="Platform"
                    options={platformOptions}
                    value={value.platform.value}
                    onChange={(option) => update({ platform: option })}
                    selectSize={inputSize}
                />
                <Select<StatusType, StatusType>
                    id="status-select"
                    label="Status"
                    options={statusOptions}
                    value={value.status.value}
                    onChange={(option) => update({ status: option })}
                    selectSize={inputSize}
                />
                <Input
                    id="price-input"
                    label="Price"
                    type="number"
                    value={value.price}
                    onChange={(e) => update({ price: e.target.value })}
                    inputSize={inputSize}
                    hasErrorText={false}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                />
                <DatePicker
                    label="Purchase Date"
                    value={value.datePurchased}
                    onChange={(date) => update({ datePurchased: date })}
                    inputSize={inputSize}
                />
                <Input
                    id="hours-input"
                    label="Hours"
                    type="number"
                    value={value.hoursPlayed}
                    onChange={(e) => update({ hoursPlayed: e.target.value })}
                    inputSize={inputSize}
                    hasErrorText={false}
                    min="0"
                    step="1"
                    placeholder="0"
                />
                <Input
                    id="rating-input"
                    label="Rating"
                    type="number"
                    value={value.rating}
                    onChange={(e) => update({ rating: e.target.value })}
                    inputSize={inputSize}
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
                value={value.comment}
                onChange={(e) => update({ comment: e.target.value })}
            />
        </>
    );
};

export default GameFormFields;
