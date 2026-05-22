import { type GenreType } from "./UserLibrary";

export type GameSearchResult = {
    id: number;
    title: string;
    coverUrl: string | null;
    platforms: string[];
    genres: NonNullable<GenreType[]>;
};
