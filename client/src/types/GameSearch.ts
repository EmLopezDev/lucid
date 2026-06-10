import { type GenreType } from "@lucid/types";

export type GameSearchResult = {
    id: number;
    title: string;
    coverUrl: string | null;
    platforms: string[];
    genres: NonNullable<GenreType[]>;
};
