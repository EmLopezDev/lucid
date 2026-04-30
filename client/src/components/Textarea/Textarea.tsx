import { type ChangeEvent, type TextareaHTMLAttributes, useId } from "react";
import { cx } from "css-variants";

type TextareaProps = {
    textareaSize?: "small" | "medium" | "large";
    label?: string;
    errorText?: string;
    hasErrorText?: boolean;
    maxCount?: number; // enables character counter when provided
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange">;

const Textarea = ({
    textareaSize = "medium",
    label,
    errorText,
    hasErrorText = true,
    maxCount,
    onChange,
    id,
    value = "",
    rows = 4,
    ...props
}: TextareaProps) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const currentCount = String(value).length;

    return (
        <div className="textarea__container">
            {label && (
                <label
                    htmlFor={textareaId}
                    className={cx({
                        textarea__label: true,
                        [`textarea__label--${textareaSize}`]: textareaSize,
                    })}
                >
                    {label}
                    {props.required && (
                        <span
                            className="textarea__required"
                            aria-hidden="true"
                        >
                            *
                        </span>
                    )}
                </label>
            )}
            <textarea
                id={textareaId}
                rows={rows}
                value={value}
                className={cx({
                    textarea: true,
                    [`textarea--${textareaSize}`]: textareaSize,
                })}
                onChange={onChange}
                aria-invalid={!!errorText}
                aria-describedby={
                    [
                        hasErrorText ? `${textareaId}-error` : null,
                        maxCount ? `${textareaId}-counter` : null,
                    ]
                        .filter(Boolean)
                        .join(" ") || undefined
                }
                maxLength={maxCount}
                {...props}
            />
            <div className="textarea__footer">
                {hasErrorText && (
                    <span
                        id={`${textareaId}-error`}
                        className="textarea__error"
                        role="alert"
                        aria-live="polite"
                    >
                        {errorText}
                    </span>
                )}
                {maxCount && (
                    <span
                        id={`${textareaId}-counter`}
                        className={cx({
                            textarea__counter: true,
                            "textarea__counter--warn": currentCount >= maxCount * 0.9,
                            "textarea__counter--limit": currentCount >= maxCount,
                        })}
                        aria-live="polite"
                    >
                        {currentCount} / {maxCount}
                    </span>
                )}
            </div>
        </div>
    );
};

export default Textarea;
