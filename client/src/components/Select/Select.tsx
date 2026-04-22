// Define the shape of each option
import { cx } from "css-variants";
import { capitalizeString } from "../../lib/string";

export interface SelectOptionType {
    value: string | number;
    label: string;
}

// Define props for the Select component
interface SelectType {
    id: string;
    selectSize?: "small" | "medium" | "large";
    options: SelectOptionType[];
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select = ({ id, selectSize = "medium", options, value, onChange }: SelectType) => {
    const selectClassName = cx({
        select: true,
        [`${selectSize}`]: selectSize,
    });
    return (
        <select
            id={id}
            className={selectClassName}
            value={value}
            onChange={onChange}
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
