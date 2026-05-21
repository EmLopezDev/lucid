import { useState, useRef, useEffect, type ReactNode, type ChangeEvent } from "react";
import Input from "@components/Input/Input";

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

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onQueryChange(e.target.value);
        setIsOpen(true);
        if (hasSelected) {
            setHasSelected(false);
            onReset();
        }
    };

    const handleSelect = (result: T) => {
        onQueryChange(getLabel(result));
        setIsOpen(false);
        setHasSelected(true);
        onSelect(result);
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
                inputSize={inputSize}
                hasErrorText={false}
                placeholder={placeholder}
                autoComplete="off"
            />
            {showDropdown && (
                <ul
                    className="search-input__dropdown"
                    role="listbox"
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
                        results.map((result) => (
                            <li
                                key={getKey(result)}
                                role="option"
                                aria-selected="false"
                                className="search-input__result"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelect(result);
                                }}
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
