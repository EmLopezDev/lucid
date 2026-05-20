import { type PlatformType, type GenreType } from "./UserLibrary";

export type GameSearchResult = {
    id: number;
    title: string;
    coverUrl: string | null;
    platforms: PlatformType[];
    genres: GenreType[];
};
