import { useId } from "react";
import { type SelectOptionType } from "../../types/SelectOptionsTypes";

type RadioGroupType = {
    legend?: string;
    name: string;
    options: SelectOptionType[];
    direction?: "row" | "column";
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
};

const RadioGroup = ({
    legend,
    name,
    options,
    direction = "row",
    value,
    onChange,
    required = false,
}: RadioGroupType) => {
    const id = useId();

    return (
        <fieldset
            className={`radio-group radio-group--${direction}`}
            aria-required={required}
        >
            {legend && (
                <legend className="radio-group__legend">
                    {legend}
                    {required && (
                        <span
                            className="radio-group__required"
                            aria-hidden="true"
                        >
                            *
                        </span>
                    )}
                </legend>
            )}
            {options.map((option) => {
                const inputId = `${id}-${option.value}`;
                return (
                    <label
                        key={option.value}
                        htmlFor={inputId}
                        className="radio-group__label"
                    >
                        <input
                            id={inputId}
                            className="radio-group__input"
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                        />
                        {option.label}
                    </label>
                );
            })}
        </fieldset>
    );
};

export default RadioGroup;
