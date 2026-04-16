import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number = 800) {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(timeoutId);
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;
