import config from "../config";
import { Genre, type PlatformType, type GenreType } from "../../../packages";

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

const PLATFORM_MAP: Record<string, PlatformType> = {
    pc: "PC",
    macos: "PC",
    linux: "PC",
    playstation5: "playstation",
    playstation4: "playstation",
    playstation3: "playstation",
    playstation2: "playstation",
    playstation: "playstation",
    "ps-vita": "playstation",
    psp: "playstation",
    "xbox-series-x": "xbox",
    "xbox-one": "xbox",
    xbox360: "xbox",
    xbox: "xbox",
    "nintendo-switch": "nintendo",
    "wii-u": "nintendo",
    wii: "nintendo",
    gamecube: "nintendo",
    "nintendo-64": "nintendo",
    snes: "nintendo",
    nes: "nintendo",
    "game-boy-advance": "nintendo",
    "game-boy-color": "nintendo",
    "game-boy": "nintendo",
    "nintendo-3ds": "nintendo",
    "nintendo-ds": "nintendo",
};

const GENRE_MAP: Record<string, GenreType> = {
    "role-playing-games-rpg": "role-playing",
    "massively-multiplayer": "multiplayer",
};

const mapPlatforms = (entries: RawgPlatformEntryType[]): PlatformType[] => {
    const mapped = entries
        .map((entry) => PLATFORM_MAP[entry.platform.slug])
        .filter(Boolean) as PlatformType[];
    return [...new Set(mapped)];
};

const mapGenres = (entries: RawgGenreType[]): GenreType[] => {
    const mapped = entries
        .map((entry) => GENRE_MAP[entry.slug] ?? entry.slug)
        .filter((g) => Genre.safeParse(g).success) as GenreType[];
    return [...new Set(mapped)];
};

export type GameSearchResult = {
    id: number;
    title: string;
    coverUrl: string | null;
    platforms: PlatformType[];
    genres: GenreType[];
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
