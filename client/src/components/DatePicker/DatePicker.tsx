import { useState, useRef, useEffect, useLayoutEffect, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import { cx } from "css-variants";
import Button from "@components/Button";
import Icon from "@components/Icon";
import "react-day-picker/style.css";

type DatePickerProps = {
    id?: string;
    label?: string;
    value?: string;
    onChange: (value: string) => void;
    inputSize?: "small" | "medium" | "large";
    maxDate?: Date;
};

// Coordinates used to position the popup with position:fixed
type PopupPosition = {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
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

const POPUP_OFFSET = 4; // px gap between trigger and popup
const EDGE_MARGIN = 8; // minimum px gap between popup and viewport edge

const DatePicker = ({
    id,
    label,
    value,
    onChange,
    inputSize = "medium",
    maxDate,
}: DatePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<Date | undefined>(parseDate(value));

    // position holds the fixed pixel coordinates for the popup.
    // We start with an empty object and populate it as soon as the trigger is measured.
    const [position, setPosition] = useState<PopupPosition>({});

    const datePickerId = useId();
    const finalId = id ?? datePickerId;
    // triggerRef lets us read the trigger button's screen coordinates at open time.
    // containerRef covers the trigger + label so we can detect outside clicks.
    // popupRef lets us measure the rendered popup to check for viewport overflow.
    const triggerRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    // --- RESIZE ---
    // The popup is positioned with fixed pixel coordinates captured at open time.
    // If the window resizes those coordinates become stale, so just close the popup.
    useEffect(() => {
        if (!isOpen) return;
        const handleResize = () => {
            setIsOpen(false);
            setPosition({});
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isOpen]);

    // --- OUTSIDE CLICK ---
    // Because the popup is portalled to <body> it is no longer a DOM descendant of
    // containerRef, so we must check BOTH refs to decide if a click is "inside".
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            const insideTrigger = containerRef.current?.contains(target);
            const insidePopup = popupRef.current?.contains(target);
            if (!insideTrigger && !insidePopup) {
                setIsOpen(false);
                setPosition({});
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // --- VIEWPORT OVERFLOW CORRECTION ---
    // After the popup mounts we measure its bounding rect and check whether any edge
    // falls outside the viewport. If so we flip to the opposite side.
    // useLayoutEffect is synchronous before the browser paints, so there is no flicker.
    useLayoutEffect(() => {
        if (!isOpen || !popupRef.current || !triggerRef.current) return;

        const popup = popupRef.current.getBoundingClientRect();
        const trigger = triggerRef.current.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        setPosition((prev) => {
            const next = { ...prev };

            if (popup.right > vw - EDGE_MARGIN) {
                next.left = undefined;
                next.right = vw - trigger.right;
            }

            if (popup.bottom > vh - EDGE_MARGIN) {
                next.top = undefined;
                next.bottom = vh - trigger.top + POPUP_OFFSET;

                // If flipping above would also overflow the top, pin to edge margin
                const topAfterFlip = trigger.top - POPUP_OFFSET - popup.height;
                if (topAfterFlip < EDGE_MARGIN) {
                    next.top = EDGE_MARGIN;
                    next.bottom = undefined;
                }
            }

            return next;
        });
    }, [isOpen]);

    // --- TOGGLE ---
    // On open: read the trigger's viewport coordinates immediately and use them as the
    // initial popup position (below-left of the trigger). useLayoutEffect will then
    // fine-tune this if the popup overflows.
    // On close: clear the stored position so stale coordinates don't flash on next open.
    const handleToggle = useCallback(() => {
        if (!triggerRef.current) return;

        if (isOpen) {
            setIsOpen(false);
            setPosition({});
            return;
        }

        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
            top: rect.bottom + POPUP_OFFSET,
            left: rect.left,
        });
        setIsOpen(true);
    }, [isOpen]);

    const handleSelect = useCallback(
        (date: Date | undefined) => {
            if (!date) return;
            setSelected(date);
            onChange(toISODate(date));
            setIsOpen(false);
            setPosition({});
        },
        [onChange],
    );

    // --- PORTAL ---
    // The popup is rendered as a direct child of <body> via createPortal.
    // This means it lives completely outside the card detail panel's DOM subtree,
    // so no ancestor's z-index, overflow, or stacking context can affect it.
    // Position is driven entirely by the inline style object — no CSS relative
    // positioning needed.
    const handleSelectToday = useCallback(() => {
        const today = new Date();
        setSelected(today);
        onChange(toISODate(today));
        setIsOpen(false);
        setPosition({});
    }, [onChange]);

    const handleClear = useCallback(() => {
        setSelected(undefined);
        onChange("");
        setIsOpen(false);
        setPosition({});
    }, [onChange]);

    const popup = (
        <div
            id={finalId}
            ref={popupRef}
            className="date-picker__popup"
            style={{
                position: "fixed",
                top: position.top,
                bottom: position.bottom,
                left: position.left,
                right: position.right,
            }}
            role="dialog"
            aria-label="Date picker calendar"
            aria-modal="true"
        >
            {/* captionLayout="dropdown" replaces the plain month/year text label with
                native <select> dropdowns so the user can jump directly to any month or
                year without clicking the prev/next arrows repeatedly. */}
            <DayPicker
                mode="single"
                selected={selected}
                onSelect={handleSelect}
                defaultMonth={selected ?? new Date()}
                startMonth={new Date(1980, 0)}
                endMonth={maxDate}
                captionLayout="dropdown"
                fixedWeeks
            />
            <div className="date-picker__footer">
                <Button
                    buttonSize="x-small"
                    variant="primary"
                    onClick={handleSelectToday}
                >
                    Today
                </Button>
                <Button
                    buttonSize="x-small"
                    variant="secondary"
                    onClick={handleClear}
                >
                    Clear
                </Button>
            </div>
        </div>
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
                ref={triggerRef}
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

            {isOpen && createPortal(popup, document.body)}
        </div>
    );
};

export default DatePicker;
