import { useMemo } from "react";
import { useUserLibraryContext } from "@contexts/UserLibraryContext/useUserLibraryContext";

export const useRecentGames = (limit = 6) => {
    const { libraryData } = useUserLibraryContext();

    return useMemo(
        () =>
            [...libraryData]
                .sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
                )
                .slice(0, limit),
        [libraryData, limit],
    );
};
