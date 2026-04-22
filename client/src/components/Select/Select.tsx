// Define the shape of each option
import { cx } from "css-variants";
import { capitalizeString } from "../../lib/string";
import type { ChangeEvent } from "react";

export interface SelectOptionType {
    value: string;
    label: string;
}

// Define props for the Select component
interface SelectType {
    id: string;
    selectSize?: "small" | "medium" | "large";
    options: SelectOptionType[];
    value: string | number;
    onChange: (option: SelectOptionType) => void;
}

const Select = ({ id, selectSize = "medium", options, value, onChange }: SelectType) => {
    const selectClassName = cx({
        select: true,
        [`${selectSize}`]: selectSize,
    });

    const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        const value: SelectOptionType = { value: e.target.value, label: e.target.value };
        onChange(value);
    };

    return (
        <select
            id={id}
            className={selectClassName}
            value={value}
            onChange={handleChangeSelect}
        >
            {options.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                >
                    {capitalizeString(option.label)}
                </option>
            ))}
        </select>
    );
};

export default Select;
