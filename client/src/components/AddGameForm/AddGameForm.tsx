import { useState, useCallback, type SubmitEvent } from "react";
import Form from "@components/Form/Form";
import GameFormFields, { type GameFormData } from "@components/GameFormFields/GameFormFields";
import SearchInput from "@components/SearchInput/SearchInput";
import { useGameSearch } from "@hooks/useGameSearch";
import { type PostUserLibraryGameBodyType } from "../../../../packages/types/UserLibrary";
import { type GameSearchResult, type GenreType } from "../../../../packages/types";
import { genreOptions, platformOptions, statusOptions } from "@lib/form";

const emptyFormData: GameFormData = {
    title: "",
    genre: genreOptions[0]!,
    platform: platformOptions[0]!,
    status: statusOptions[0]!,
    price: "",
    datePurchased: "",
    hoursPlayed: "",
    rating: "",
    comment: "",
};

type AddGameFormProps = {
    onSubmit: (data: PostUserLibraryGameBodyType) => void;
    onCancel: () => void;
};

const AddGameForm = ({ onSubmit, onCancel }: AddGameFormProps) => {
    const [formData, setFormData] = useState<GameFormData>(emptyFormData);
    const [query, setQuery] = useState("");
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    const [availablePlatforms, setAvailablePlatforms] = useState<string[] | undefined>(undefined);
    const [availableGenres, setAvailableGenres] = useState<GenreType[] | undefined>(undefined);

    const { results, isLoading } = useGameSearch(query);

    const handleQueryChange = useCallback((value: string) => {
        setQuery(value);
        setFormData((prev) => ({ ...prev, title: value }));
    }, []);

    const handleGameSelect = useCallback((game: GameSearchResult) => {
        const firstPlatform =
            game.platforms.length > 0
                ? { value: game.platforms[0]!, label: game.platforms[0]! }
                : platformOptions[0]!;

        const firstGenre =
            game.genres.length > 0
                ? { value: game.genres[0]!, label: game.genres[0]! }
                : genreOptions[0]!;

        setFormData((prev) => ({
            ...prev,
            title: game.title,
            platform: firstPlatform,
            genre: firstGenre,
        }));
        setCoverUrl(game.coverUrl ?? null);
        setAvailablePlatforms(game.platforms.length > 0 ? game.platforms : undefined);
        setAvailableGenres(game.genres.length > 0 ? game.genres : undefined);
    }, []);

    const handleReset = useCallback(() => {
        setFormData((prev) => ({
            ...prev,
            title: "",
            platform: platformOptions[0]!,
            genre: genreOptions[0]!,
        }));
        setCoverUrl(null);
        setAvailablePlatforms(undefined);
        setAvailableGenres(undefined);
    }, []);

    const handleSubmit = useCallback(
        (e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!formData.title.trim()) return;

            onSubmit({
                title: formData.title.trim(),
                genre: formData.genre.value,
                platform: formData.platform.value,
                status: formData.status.value,
                favorite: false,
                price: formData.price || null,
                date_purchased: formData.datePurchased || null,
                date_played: null,
                hours_played: formData.hoursPlayed ? Number(formData.hoursPlayed) : null,
                rating: formData.rating ? Number(formData.rating) : null,
                comment: formData.comment || null,
                cover_url: coverUrl,
            });
        },
        [formData, coverUrl, onSubmit],
    );

    return (
        <Form onSubmit={handleSubmit} onCancel={onCancel} primaryButtonText="Add Game">
            <GameFormFields
                value={formData}
                onChange={setFormData}
                availablePlatforms={availablePlatforms}
                availableGenres={availableGenres}
                titleInput={
                    <SearchInput<GameSearchResult>
                        label="Title"
                        placeholder="Search for a game..."
                        inputSize="medium"
                        query={query}
                        results={results}
                        isLoading={isLoading}
                        onQueryChange={handleQueryChange}
                        onSelect={handleGameSelect}
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
                }
            />
        </Form>
    );
};

export default AddGameForm;
