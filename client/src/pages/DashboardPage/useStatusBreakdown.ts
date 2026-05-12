import { useMemo } from "react";
import { useUserLibraryContext } from "../../contexts/UserLibraryContext/useUserLibraryContext";
import { type StatusType } from "@lucid/types";

const STATUS_COLORS: Record<StatusType, string> = {
    playing: "#ef9f27",
    completed: "#5dcaa5",
    paused: "#5b9bd5",
    dropped: "#e5534b",
    wishlist: "#a78bfa",
};

export type StatusDataType = {
    status: StatusType;
    count: number;
    fill: string;
};

export const useStatusBreakdown = () => {
    const { libraryData } = useUserLibraryContext();

    const data = useMemo<StatusDataType[]>(() => {
        const counts = libraryData.reduce<Record<string, number>>((acc, game) => {
            acc[game.status] = (acc[game.status] ?? 0) + 1;
            return acc;
        }, {});

        return (Object.keys(STATUS_COLORS) as StatusType[])
            .filter((status) => counts[status] > 0)
            .map((status) => ({ status, count: counts[status], fill: STATUS_COLORS[status] }));
    }, [libraryData]);

    return { data };
};
