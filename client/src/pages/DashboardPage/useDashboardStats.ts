import { useUserLibraryContext } from "@contexts/UserLibraryContext/useUserLibraryContext";

export const useDashboardStats = () => {
    const { libraryData } = useUserLibraryContext();

    const totalGames = libraryData.length;

    const totalHoursPlayed = libraryData.reduce((acc, val) => {
        const hoursPlayed = val.hours_played ?? 0;
        return acc + hoursPlayed;
    }, 0);

    const totalSpent = libraryData.reduce((acc, val) => {
        const price = Number(val.price);
        return +(acc + price).toFixed(2);
    }, 0);

    const ratedGames = libraryData.filter((val) => val.rating !== null);
    const averageRating =
        ratedGames.length === 0
            ? 0
            : +(ratedGames.reduce((acc, val) => acc + val.rating!, 0) / ratedGames.length).toFixed(2);

    return {
        totalGames,
        totalHoursPlayed,
        totalSpent,
        averageRating,
    };
};
