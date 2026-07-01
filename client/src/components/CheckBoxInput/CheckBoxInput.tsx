import { useId } from "react";
import { type ChangeEvent } from "react";

type CheckBoxInputProps = {
    label: string;
    checked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    id?: string;
};

const CheckBoxInput = ({ label, checked, onChange, id }: CheckBoxInputProps) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;

    return (
        <label
            htmlFor={checkboxId}
            className="checkbox-input__label"
        >
            <input
                id={checkboxId}
                type="checkbox"
                className="checkbox-input__input"
                checked={checked}
                onChange={onChange}
            />
            {label}
        </label>
    );
};

export default CheckBoxInput;
