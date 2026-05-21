import { useEffect, useState } from "react";
import { useDebounce } from "@lib/debounce";
import { API_URL } from "@config/api";
import { type GameSearchResult } from "@lucid/types";

type UseGameSearchResultType = {
    results: GameSearchResult[];
    isLoading: boolean;
    error: string | null;
};

export const useGameSearch = (query: string): UseGameSearchResultType => {
    const [results, setResults] = useState<GameSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedQuery = useDebounce(query, 500);

    useEffect(() => {
        if (debouncedQuery.trim().length < 2) return;

        const controller = new AbortController();

        const search = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `${API_URL}/games/search/q=${encodeURIComponent(debouncedQuery)}`,
                    { credentials: "include", signal: controller.signal },
                );
                if (!response.ok) throw new Error("Search failed");

                const data: GameSearchResult[] = await response.json();
                setResults(data);
            } catch (error) {
                if (error instanceof Error && error.name === "AbortError") return;
                setError("Failed to search game");
                if (import.meta.env.Dev) {
                    console.error(error instanceof Error ? error.message : error);
                }
            } finally {
                setIsLoading(false);
            }
        };
        search();

        return () => controller.abort();
    }, [debouncedQuery]);

    const isTooShort = debouncedQuery.trim().length < 2;

    return {
        results: isTooShort ? [] : results,
        isLoading: isTooShort ? false : isLoading,
        error,
    };
};
