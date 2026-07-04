import { useState, useCallback, type SubmitEvent } from "react";
import Form from "@components/Form";
import SearchInput from "@components/SearchInput";
import { useGameSearch } from "@hooks/useGameSearch";
import { type GameSearchResult } from "../../types/GameSearch";
import DatePicker from "@components/DatePicker";
import RadioGroup from "@components/RadioGroup";

type GameStatus = "completed" | "dropped";

type ChangeGameFormType = {
    currentGameTitle: string;
    onSubmit: (
        game: GameSearchResult,
        startDate: string | null,
        endDate: string | null,
        gameStatus: GameStatus,
    ) => void;
    onCancel: () => void;
};

const ChangeGameForm = ({ currentGameTitle, onSubmit, onCancel }: ChangeGameFormType) => {
    const [query, setQuery] = useState("");
    const [selectedGame, setSelectedGame] = useState<GameSearchResult | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [gameStatus, setGameStatus] = useState<GameStatus>("completed");

    const { results, isLoading } = useGameSearch(query);

    const handleQueryChange = useCallback((value: string) => setQuery(value), []);
    const handleSelect = useCallback((game: GameSearchResult) => setSelectedGame(game), []);
    const handleReset = useCallback(() => setSelectedGame(null), []);

    const handleSubmit = useCallback(
        (e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!selectedGame) return;
            onSubmit(selectedGame, startDate || null, endDate || null, gameStatus);
        },
        [selectedGame, startDate, endDate, gameStatus, onSubmit],
    );

    return (
        <Form
            primaryButtonText="Change Game"
            primaryButtonDisabled={!selectedGame}
            onSubmit={handleSubmit}
            onCancel={onCancel}
        >
            <div className="change-game-form__archive">
                <p className="change-game-form__archive-label">
                    Mark <strong>{currentGameTitle}</strong> as:
                </p>
                <RadioGroup
                    name="game-status"
                    value={gameStatus}
                    onChange={(val) => setGameStatus(val as GameStatus)}
                    options={[
                        { label: "Completed", value: "completed" },
                        { label: "Dropped", value: "dropped" },
                    ]}
                />
            </div>

            <hr className="change-game-form__divider" />

            <SearchInput<GameSearchResult>
                label="New Game"
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

export default ChangeGameForm;
