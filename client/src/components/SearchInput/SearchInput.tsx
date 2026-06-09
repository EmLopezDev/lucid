import {
    useState,
    useRef,
    useEffect,
    type ReactNode,
    type ChangeEvent,
    type KeyboardEvent,
} from "react";
import Input from "@components/Input";

type SearchInputType<T> = {
    label?: string;
    placeholder?: string;
    inputSize: "small" | "medium" | "large";
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

    const containerRef = useRef<HTMLDivElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    // Scroll the focused item into view when navigating with arrow keys
    useEffect(() => {
        if (focusedIndex < 0 || !listboxRef.current) return;
        const options = listboxRef.current.querySelectorAll('[role="option"]');
        options[focusedIndex]?.scrollIntoView({ block: "nearest" });
    }, [focusedIndex]);

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
            {showDropdown && (
                <ul
                    className="search-input__dropdown"
                    role="listbox"
                    ref={listboxRef}
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
                </ul>
            )}
        </div>
    );
};

export default SearchInput;
