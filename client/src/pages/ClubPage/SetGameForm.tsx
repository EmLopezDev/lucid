import { useState, useCallback, type SubmitEvent } from "react";
import Form from "@components/Form";
import SearchInput from "@components/SearchInput";
import { useGameSearch } from "@hooks/useGameSearch";
import { type GameSearchResult } from "../../types/GameSearch";
import DatePicker from "@components/DatePicker";

type SetGameFormType = {
    onSubmit: (game: GameSearchResult, startDate: string | null, endDate: string | null) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
};

const SetGameForm = ({ onSubmit, onCancel, isSubmitting }: SetGameFormType) => {
    const [query, setQuery] = useState("");
    const [selectedGame, setSelectedGame] = useState<GameSearchResult | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const { results, isLoading } = useGameSearch(query);

    const handleQueryChange = useCallback((value: string) => {
        setQuery(value);
    }, []);

    const handleSelect = useCallback((game: GameSearchResult) => {
        setSelectedGame(game);
    }, []);

    const handleReset = useCallback(() => {
        setSelectedGame(null);
    }, []);

    const handleSubmit = useCallback(
        (e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!selectedGame) return;
            onSubmit(selectedGame, startDate || null, endDate || null);
        },
        [selectedGame, startDate, endDate, onSubmit],
    );

    return (
        <Form
            primaryButtonText="Set Game"
            primaryButtonDisabled={!selectedGame}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            isLoading={isSubmitting}
        >
            <SearchInput<GameSearchResult>
                label="Game"
                placeholder="Search for a game..."
                query={query}
                results={results}
                isLoading={isLoading}
                onQueryChange={handleQueryChange}
                onSelect={handleSelect}
                onReset={handleReset}
                renderResult={(result) => (
                    <div className="search-input__result-game">
                        {result.coverUrl ? (
                            <img
                                className="search-input__result-cover"
                                src={result.coverUrl}
                                alt=""
                                aria-hidden="true"
                            />
                        ) : (
                            <div className="search-input__result-cover search-input__result-cover--empty" />
                        )}
                        <span className="search-input__result-title">{result.title}</span>
                    </div>
                )}
                getKey={(result) => result.id}
                getLabel={(result) => result.title}
            />
            <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                maxDate={new Date()}
            />
            <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
            />
        </Form>
    );
};

export default SetGameForm;
