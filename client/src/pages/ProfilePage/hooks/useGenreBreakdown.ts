import { useMemo } from "react";
import { useUserLibraryContext } from "@contexts/UserLibraryContext/useUserLibraryContext";
import { type GenreType } from "@lucid/types";

const GENRE_COLORS: Record<NonNullable<GenreType>, string> = {
    action: "#ef9f27",
    adventure: "#5dcaa5",
    "role-playing": "#a78bfa",
    strategy: "#5b9bd5",
    shooter: "#e5534b",
    simulation: "#61c4e8",
    puzzle: "#f472b6",
    platformer: "#34d399",
    racing: "#fb923c",
    sports: "#22d3ee",
    fighting: "#f87171",
    indie: "#818cf8",
    casual: "#fbbf24",
    arcade: "#c084fc",
    multiplayer: "#4ade80",
    family: "#60a5fa",
    other: "#94a3b8",
};

export type GenreDataType = {
    genre: NonNullable<GenreType>;
    count: number;
    fill: string;
};

export const useGenreBreakdown = () => {
    const { libraryData } = useUserLibraryContext();

    const data = useMemo<GenreDataType[]>(() => {
        const counts = libraryData.reduce<Record<string, number>>((acc, game) => {
            if (!game.genre) return acc;
            acc[game.genre] = (acc[game.genre] ?? 0) + 1;
            return acc;
        }, {});

        return (Object.keys(GENRE_COLORS) as NonNullable<GenreType>[])
            .filter((genre) => counts[genre] > 0)
            .map((genre) => ({ genre, count: counts[genre], fill: GENRE_COLORS[genre] }))
            .sort((a, b) => b.count - a.count);
    }, [libraryData]);

    return { data };
};
