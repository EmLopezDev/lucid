import { useState, useMemo } from "react";
import { useUserLibraryContext } from "../../contexts/UserLibraryContext/useUserLibraryContext";

export type TimePeriodType = "all" | "12m" | "6m" | "3m" | "30d";

export type SpendingDataType = {
    month: string;
    spent: number;
    cumulative: number;
};

const getTimePeriodStart = (period: TimePeriodType): Date | null => {
    if (!period || period === "all") return null;

    const now = new Date();

    if (period === "30d") {
        const date = new Date(now);
        date.setDate(date.getDate() - 30);
        return date;
    }
    const monthsBack = { "12m": 12, "6m": 6, "3m": 3 };
    const date = new Date(now);
    date.setMonth(date.getMonth() - monthsBack[period]);
    return date;
};

export const useSpendingChart = () => {
    const { libraryData } = useUserLibraryContext();
    const [period, setPeriod] = useState<TimePeriodType>("12m");

    const data = useMemo<SpendingDataType[]>(() => {
        const start = getTimePeriodStart(period);

        const games = libraryData
            .filter((game) => {
                if (!Number(game.price)) return false;
                const date = new Date(game.date_purchased ?? game.created_at);
                return start ? date >= start : true;
            })
            .sort((a, b) => {
                const dateA = new Date(a.date_purchased ?? a.created_at);
                const dateB = new Date(b.date_purchased ?? b.created_at);
                return dateA.getTime() - dateB.getTime();
            });

        const monthMap = new Map<string, number>();

        for (const game of games) {
            const date = new Date(game.date_purchased ?? game.created_at);
            const key = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
            monthMap.set(key, +((monthMap.get(key) ?? 0) + Number(game.price)).toFixed(2));
        }

        let cumulative = 0;
        return Array.from(monthMap.entries()).map(([month, spent]) => {
            cumulative = +(cumulative + spent).toFixed(2);
            return { month, spent, cumulative };
        });
    }, [libraryData, period]);

    return { data, period, setPeriod };
};
