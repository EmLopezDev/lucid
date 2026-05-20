import config from "../config";
import { Genre, type GenreType } from "../../../packages";

type RawgPlatformEntryType = {
    platform: {
        slug: string;
    };
};

type RawgGenreType = {
    slug: string;
};

type RawgGameType = {
    id: number;
    name: string;
    background_image: string | null;
    platforms: RawgPlatformEntryType[] | null;
    genres: RawgGenreType[];
};

type RawgSearchResponseType = {
    results: RawgGameType[];
};

const PLATFORM_MAP: Record<string, string> = {
    pc: "PC",
    macos: "macOS",
    linux: "Linux",
    playstation5: "PlayStation 5",
    playstation4: "PlayStation 4",
    playstation3: "PlayStation 3",
    playstation2: "PlayStation 2",
    playstation: "PlayStation",
    "ps-vita": "PS Vita",
    psp: "PSP",
    "xbox-series-x": "Xbox Series X/S",
    "xbox-one": "Xbox One",
    xbox360: "Xbox 360",
    xbox: "Xbox",
    "nintendo-switch": "Nintendo Switch",
    "wii-u": "Wii U",
    wii: "Wii",
    gamecube: "GameCube",
    "nintendo-64": "Nintendo 64",
    snes: "SNES",
    nes: "NES",
    "game-boy-advance": "Game Boy Advance",
    "game-boy-color": "Game Boy Color",
    "game-boy": "Game Boy",
    "nintendo-3ds": "Nintendo 3DS",
    "nintendo-ds": "Nintendo DS",
    nintendo: "Nintendo",
    ios: "iOS",
    android: "Android",
};

const GENRE_MAP: Record<string, GenreType> = {
    "role-playing-games-rpg": "role-playing",
    "massively-multiplayer": "multiplayer",
};

const mapPlatforms = (entries: RawgPlatformEntryType[]): string[] => {
    const mapped = entries
        .map((entry) => PLATFORM_MAP[entry.platform.slug])
        .filter(Boolean) as string[];
    return [...new Set(mapped)];
};

const mapGenres = (entries: RawgGenreType[]): GenreType[] => {
    const mapped = entries
        .map((entry) => GENRE_MAP[entry.slug] ?? entry.slug)
        .filter((g) => Genre.safeParse(g).success) as GenreType[];
    return [...new Set(mapped)];
};

export const searchGame = async (query: string) => {
    if (!config.RAWG_API_KEY) return [];

    const url = new URL("https://api.rawg.io/api/games");
    url.searchParams.set("key", config.RAWG_API_KEY);
    url.searchParams.set("search", query);
    url.searchParams.set("page_size", "10");

    const response = await fetch(url.toString());

    if (!response.ok) throw new Error(`RAWG API error: ${response.status}`);

    const data = (await response.json()) as RawgSearchResponseType;

    return data.results.map((game) => ({
        id: game.id,
        title: game.name,
        coverUrl: game.background_image,
        platforms: game.platforms ? mapPlatforms(game.platforms) : [],
        genres: game.genres ? mapGenres(game.genres) : [],
    }));
};
