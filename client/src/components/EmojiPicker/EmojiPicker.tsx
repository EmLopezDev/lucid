import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import EmojiPickerReact, { type EmojiClickData, Theme } from "emoji-picker-react";

const DEFAULT_EMOJI = "🎮";
const PICKER_HEIGHT = 450;
const PICKER_WIDTH = 350;
const GAP = 8;

type PopoverPosition = {
    top: number;
    left: number;
    height: number;
    width: number;
};

type EmojiPickerType = {
    label?: string;
    value: string;
    onChange: (emoji: string) => void;
};

const EmojiPicker = ({ label, value, onChange }: EmojiPickerType) => {
    const [isOpen, setIsOpen] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>({
        top: 0,
        left: 0,
        height: PICKER_HEIGHT,
        width: PICKER_WIDTH,
    });
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const handleEmojiClick = useCallback(
        (data: EmojiClickData) => {
            onChange(data.emoji);
            setIsOpen(false);
        },
        [onChange],
    );

    const calculatePosition = useCallback(() => {
        if (!triggerRef.current) return;

        // visualViewport reflects what's actually visible on mobile (it shrinks
        // when the on-screen keyboard opens); window.innerHeight/innerWidth don't.
        const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = viewportHeight - rect.bottom - GAP;
        const spaceAbove = rect.top - GAP;

        let top: number;
        let height: number;

        if (spaceBelow >= PICKER_HEIGHT) {
            top = rect.bottom + GAP;
            height = PICKER_HEIGHT;
        } else if (spaceAbove > spaceBelow) {
            height = Math.min(spaceAbove, PICKER_HEIGHT);
            top = rect.top - height - GAP;
        } else {
            top = rect.bottom + GAP;
            height = Math.max(spaceBelow, 0);
        }

        const width = Math.min(PICKER_WIDTH, viewportWidth - GAP * 2);
        const left = Math.min(Math.max(rect.left, GAP), viewportWidth - width - GAP);

        setPopoverPosition({ top, left, height, width });
    }, []);

    const handleTriggerClick = useCallback(() => {
        calculatePosition();
        setIsOpen((prev) => !prev);
    }, [calculatePosition]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            const outsideTrigger = triggerRef.current && !triggerRef.current.contains(target);
            const outsidePopover = popoverRef.current && !popoverRef.current.contains(target);
            if (outsideTrigger && outsidePopover) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        window.addEventListener("resize", calculatePosition);
        window.visualViewport?.addEventListener("resize", calculatePosition);
        return () => {
            window.removeEventListener("resize", calculatePosition);
            window.visualViewport?.removeEventListener("resize", calculatePosition);
        };
    }, [isOpen, calculatePosition]);

    return (
        <div className="emoji-picker">
            {label && <span className="emoji-picker__label">{label}</span>}
            <button
                ref={triggerRef}
                type="button"
                className="emoji-picker__trigger"
                onClick={handleTriggerClick}
                aria-label="Choose an emoji"
                aria-expanded={isOpen}
                aria-haspopup="dialog"
            >
                <span
                    className="emoji-picker__emoji"
                    aria-hidden="true"
                >
                    {value || DEFAULT_EMOJI}
                </span>
            </button>
            {isOpen &&
                createPortal(
                    <div
                        ref={popoverRef}
                        className="emoji-picker__popover"
                        role="dialog"
                        aria-label="Emoji picker"
                        style={{
                            top: popoverPosition.top,
                            left: popoverPosition.left,
                            width: popoverPosition.width,
                        }}
                    >
                        <EmojiPickerReact
                            onEmojiClick={handleEmojiClick}
                            theme={Theme.DARK}
                            skinTonesDisabled
                            searchPlaceholder="Search emoji..."
                            height={popoverPosition.height}
                            width="100%"
                        />
                    </div>,
                    document.body,
                )}
        </div>
    );
};

export default EmojiPicker;
