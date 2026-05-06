import { cx } from "css-variants";
import { useState, useRef, useCallback, useId, useEffect, type KeyboardEvent } from "react";
import { capitalizeString } from "../../lib/string";
import { type SelectOptionType } from "../../../../packages/types";
import Icon from "../Icon/Icon";

interface SelectType<V = string, L extends string = string> {
    id: string;
    label?: string;
    selectSize?: "small" | "medium" | "large";
    options: SelectOptionType<V, L>[];
    value: V;
    onChange: (option: SelectOptionType<V, L>) => void;
    renderOptionsLabel?: (label: L) => React.ReactNode;
    renderTriggerLabel?: (label: L) => React.ReactNode;
}

function Select<V = string, L extends string = string>({
    id,
    label,
    selectSize = "medium",
    options,
    value,
    onChange,
    renderOptionsLabel,
    renderTriggerLabel,
}: SelectType<V, L>) {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);
    const listboxId = useId();

    const generateId = useId();
    const selectId = id ?? generateId;
    const triggerId = `${selectId}-trigger`;

    const selectedOption = options.find((o) => o.value === value);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setFocusedIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Scroll focused option into view
    useEffect(() => {
        if (focusedIndex >= 0 && listboxRef.current) {
            const focusedOption = listboxRef.current.children[focusedIndex] as HTMLElement;
            focusedOption?.scrollIntoView({ block: "nearest" });
        }
    }, [focusedIndex]);

    const handleToggle = useCallback(() => {
        setIsOpen((prev) => {
            if (!prev) {
                // When opening, focus the selected option or the first
                const selectedIndex = options.findIndex((o) => o.value === value);
                setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
            } else {
                setFocusedIndex(-1);
            }
            return !prev;
        });
    }, [options, value]);

    const handleSelect = useCallback(
        (option: SelectOptionType<V, L>) => {
            onChange(option);
            setIsOpen(false);
            setFocusedIndex(-1);
        },
        [onChange],
    );

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLDivElement>) => {
            switch (e.key) {
                case "Enter":
                case " ":
                    e.preventDefault();
                    if (isOpen && focusedIndex >= 0) {
                        handleSelect(options[focusedIndex]);
                    } else {
                        handleToggle();
                    }
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    if (!isOpen) {
                        handleToggle();
                    } else {
                        setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
                    }
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    if (!isOpen) {
                        handleToggle();
                    } else {
                        setFocusedIndex((prev) => Math.max(prev - 1, 0));
                    }
                    break;
                case "Home":
                    e.preventDefault();
                    setFocusedIndex(0);
                    break;
                case "End":
                    e.preventDefault();
                    setFocusedIndex(options.length - 1);
                    break;
                case "Escape":
                    e.preventDefault();
                    setIsOpen(false);
                    setFocusedIndex(-1);
                    break;
                case "Tab":
                    setIsOpen(false);
                    setFocusedIndex(-1);
                    break;
            }
        },
        [isOpen, focusedIndex, options, handleSelect, handleToggle],
    );

    return (
        <div
            ref={containerRef}
            className="select"
            onKeyDown={handleKeyDown}
        >
            {label && (
                <label
                    htmlFor={triggerId}
                    className={cx({
                        input__label: true,
                        [`input__label--${selectSize}`]: selectSize,
                    })}
                >
                    {label}
                </label>
            )}
            {/* Trigger button */}
            <div
                id={triggerId}
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={listboxId}
                aria-activedescendant={
                    focusedIndex >= 0 ? `${listboxId}-option-${focusedIndex}` : undefined
                }
                tabIndex={0}
                className={cx({
                    select__trigger: true,
                    [`select__trigger--${selectSize}`]: selectSize,
                    "select__trigger--open": isOpen,
                })}
                onClick={handleToggle}
            >
                <span className="select__trigger-label">
                    {selectedOption
                        ? renderTriggerLabel
                            ? renderTriggerLabel(selectedOption.label)
                            : renderOptionsLabel
                                ? renderOptionsLabel(selectedOption.label)
                                : capitalizeString(selectedOption.label)
                        : "Select an option"}
                </span>
                <Icon
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size="small"
                    color="primary"
                />
            </div>

            {/* Dropdown listbox */}
            {isOpen && (
                <ul
                    ref={listboxRef}
                    id={listboxId}
                    role="listbox"
                    aria-labelledby={triggerId}
                    className="select__listbox"
                >
                    {options.map((option, index) => (
                        <li
                            key={String(option.value)}
                            id={`${listboxId}-option-${index}`}
                            role="option"
                            aria-selected={option.value === value}
                            className={cx({
                                select__option: true,
                                [`select__option--${selectSize}`]: selectSize,
                                "select__option--selected": option.value === value,
                                "select__option--focused": index === focusedIndex,
                            })}
                            onClick={() => handleSelect(option)}
                            onMouseEnter={() => setFocusedIndex(index)}
                        >
                            {renderOptionsLabel
                                ? renderOptionsLabel(option.label)
                                : capitalizeString(option.label)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Select;
