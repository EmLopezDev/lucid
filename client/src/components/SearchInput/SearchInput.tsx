import {
    useState,
    useRef,
    useEffect,
    type ReactNode,
    type ChangeEvent,
    type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import Input from "@components/Input";

type SearchInputType<T> = {
    label?: string;
    placeholder?: string;
    inputSize?: "small" | "medium" | "large";
    query: string;
    results: T[];
    minQueryLength?: number;
    isLoading: boolean;
    onSelect: (result: T) => void;
    onReset: () => void;
    onQueryChange: (value: string) => void;
    renderResult: (result: T) => ReactNode;
    getKey: (result: T) => string | number;
    getLabel: (result: T) => string;
};

const SearchInput = <T,>({
    label,
    placeholder,
    inputSize = "medium",
    query,
    results,
    isLoading,
    minQueryLength = 2,
    onSelect,
    onReset,
    onQueryChange,
    renderResult,
    getKey,
    getLabel,
}: SearchInputType<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasSelected, setHasSelected] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(
        null,
    );
    const dropdownRef = useRef<HTMLUListElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    // Scroll the focused item into view when navigating with arrow keys
    useEffect(() => {
        if (focusedIndex < 0 || !dropdownRef.current) return;
        const options = dropdownRef.current.querySelectorAll('[role="option"]');
        options[focusedIndex]?.scrollIntoView({ block: "nearest" });
    }, [focusedIndex]);

    useEffect(() => {
        if (!isOpen || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setPosition({ top: rect.bottom, left: rect.left, width: rect.width });
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handleResize = () => {
            setIsOpen(false);
            setPosition(null);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isOpen]);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            const target = e.target as Node;
            const insideContainer = containerRef.current?.contains(target);
            const insideDropdown = dropdownRef.current?.contains(target);
            if (!insideContainer && !insideDropdown) {
                setIsOpen(false);
                setPosition(null);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onQueryChange(e.target.value);
        setIsOpen(true);
        setFocusedIndex(-1);
        if (hasSelected) {
            setHasSelected(false);
            onReset();
        }
    };

    const handleSelect = (result: T) => {
        onQueryChange(getLabel(result));
        setIsOpen(false);
        setHasSelected(true);
        setFocusedIndex(-1);
        onSelect(result);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!showDropdown) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocusedIndex((prev) => Math.min(prev + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusedIndex((prev) => Math.max(prev - 1, -1));
        } else if (e.key === "Enter") {
            e.preventDefault(); // always block form submission while dropdown is open
            if (focusedIndex >= 0 && results[focusedIndex]) {
                handleSelect(results[focusedIndex]);
            }
        } else if (e.key === "Escape") {
            setIsOpen(false);
            setFocusedIndex(-1);
        }
    };

    const showDropdown = isOpen && query.trim().length >= minQueryLength;

    return (
        <div
            className={`search-input${showDropdown ? " search-input--open" : ""}`}
            ref={containerRef}
        >
            <Input
                id="search-input"
                label={label}
                value={query}
                onChange={handleChange}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                inputSize={inputSize}
                hasErrorText={false}
                placeholder={placeholder}
                autoComplete="off"
            />
            {showDropdown &&
                position &&
                createPortal(
                    <ul
                        className="search-input__dropdown"
                        role="listbox"
                        ref={dropdownRef}
                        style={{
                            position: "fixed",
                            top: position.top,
                            left: position.left,
                            width: position.width,
                        }}
                    >
                        {isLoading && (
                            <li className="search-input__status search-input__status--loading">
                                Searching...
                            </li>
                        )}
                        {!isLoading && !results.length && (
                            <li className="search-input__status">No results found</li>
                        )}
                        {!isLoading &&
                            results.map((result, index) => (
                                <li
                                    key={getKey(result)}
                                    role="option"
                                    aria-selected={index === focusedIndex}
                                    className={`search-input__result${index === focusedIndex ? " search-input__result--focused" : ""}`}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleSelect(result);
                                    }}
                                    onMouseEnter={() => setFocusedIndex(index)}
                                    onMouseLeave={() => setFocusedIndex(-1)}
                                >
                                    {renderResult(result)}
                                </li>
                            ))}
                    </ul>,
                    document.body,
                )}
        </div>
    );
};

export default SearchInput;
