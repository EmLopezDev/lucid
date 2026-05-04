import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import { cx } from "css-variants";
import Icon from "../Icon/Icon";
import "react-day-picker/style.css";

type DatePickerProps = {
    label?: string;
    value?: string;
    onChange: (value: string) => void;
    inputSize?: "small" | "medium" | "large";
};

function parseDate(value?: string): Date | undefined {
    if (!value) return undefined;
    const [y, m, d] = value.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return isNaN(date.getTime()) ? undefined : date;
}

function toISODate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function displayDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

const EDGE_MARGIN = 8;

const DatePicker = ({ label, value, onChange, inputSize = "small" }: DatePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<Date | undefined>(parseDate(value));
    const [alignRight, setAlignRight] = useState(false);
    const [openUp, setOpenUp] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // After the popup mounts, measure it against the viewport and flip sides if needed.
    // useLayoutEffect runs synchronously before the browser paints, so there is no visible flicker.
    useLayoutEffect(() => {
        if (!isOpen || !popupRef.current) return;
        const { right, bottom } = popupRef.current.getBoundingClientRect();
        setAlignRight(right > window.innerWidth - EDGE_MARGIN);
        setOpenUp(bottom > window.innerHeight - EDGE_MARGIN);
    }, [isOpen]);

    const handleToggle = useCallback(() => {
        setIsOpen((prev) => {
            if (prev) {
                setAlignRight(false);
                setOpenUp(false);
            }
            return !prev;
        });
    }, []);

    const handleSelect = useCallback(
        (date: Date | undefined) => {
            setSelected(date);
            onChange(date ? toISODate(date) : "");
            setIsOpen(false);
        },
        [onChange],
    );

    return (
        <div
            className="date-picker"
            ref={containerRef}
        >
            {label && (
                <span
                    className={cx({
                        input__label: true,
                        [`input__label--${inputSize}`]: inputSize,
                    })}
                >
                    {label}
                </span>
            )}
            <button
                type="button"
                className={cx({
                    "date-picker__trigger": true,
                    [`date-picker__trigger--${inputSize}`]: inputSize,
                    "date-picker__trigger--open": isOpen,
                })}
                onClick={handleToggle}
                aria-expanded={isOpen}
                aria-haspopup="dialog"
            >
                <span className="date-picker__trigger-label">
                    {selected ? displayDate(selected) : "Select date"}
                </span>
                <Icon
                    name="calendar"
                    size="small"
                    color="primary"
                />
            </button>

            {isOpen && (
                <div
                    ref={popupRef}
                    className={cx({
                        "date-picker__popup": true,
                        "date-picker__popup--align-right": alignRight,
                        "date-picker__popup--open-up": openUp,
                    })}
                    role="dialog"
                    aria-label="Date picker calendar"
                    aria-modal="true"
                >
                    <DayPicker
                        mode="single"
                        selected={selected}
                        onSelect={handleSelect}
                        defaultMonth={selected ?? new Date()}
                        startMonth={new Date(2000, 0)}
                        endMonth={new Date()}
                    />
                </div>
            )}
        </div>
    );
};

export default DatePicker;
