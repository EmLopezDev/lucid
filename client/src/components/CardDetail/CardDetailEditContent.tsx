import { useCallback, useState, type SubmitEvent } from "react";
import Form from "../Form/Form";
import Input from "../Input/Input";
import Select from "../Select/Select";
import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";
import {
    type PlatformType,
    type StatusType,
    type PlatformOptionType,
    type StatusOptionType,
} from "../../../../packages/types";
import { platformOptions, statusOptions } from "../../lib/form";

type CardDetailEditContent = {
    data: UserLibraryDataType;
    onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
    onCancel: () => void;
};

type EditFormDataType = {
    platform?: PlatformOptionType;
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

    const onStatusSelect = useCallback((option: StatusOptionType) => {
        setStatus(option);
        setFormData((prevState) => ({ ...prevState, status: option }));
    }, []);

    const onPlatformSelect = useCallback((option: PlatformOptionType) => {
        setPlatform(option);
        setFormData((prevState) => ({ ...prevState, platform: option }));
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
            <span className="card-detail__content__title">{data.title}</span>
            <span className="card-detail__content__genre">{data.genre}</span>
            <Form
                buttonSize="small"
                onSubmit={handleOnSubmit}
                onCancel={onCancel}
            >
                <div
                    style={{
                        width: "100%",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "8px",
                        boxSizing: "border-box",
                    }}
                >
                    <Select<PlatformType, PlatformType>
                        id="1"
                        options={platformOptions}
                        value={platform.value}
                        onChange={onPlatformSelect}
                        selectSize="small"
                    />
                    <Select<StatusType, StatusType>
                        id="2"
                        options={statusOptions}
                        value={status.value}
                        onChange={onStatusSelect}
                        selectSize="small"
                    />
                    {data.ownership.type === "own" && (
                        <>
                            <Input
                                label="Price"
                                type="number"
                                onChange={() => {}}
                                inputSize="small"
                                hasErrorText={false}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                            <Input
                                label="Purchase Date"
                                type="date"
                                value={
                                    data.ownership.date_purchased?.toISOString().split("T")[0] ??
                                    new Date().toISOString().split("T")[0]
                                }
                                onChange={() => {}}
                                inputSize="small"
                                hasErrorText={false}
                            />
                        </>
                    )}
                    <Input
                        label="Hours"
                        type="number"
                        value={data.hours_played ?? 0}
                        onChange={() => {}}
                        inputSize="small"
                        hasErrorText={false}
                        min="0"
                    />
                    <Input
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
                <label htmlFor="">
                    Comment
                    <textarea
                        name=""
                        id=""
                    ></textarea>
                </label>
            </Form>
        </>
    );
};

export default CardDetailEditContent;
