import { useUserContext } from "@contexts/UserContext/useUserContext";
import { type StatusType } from "@lucid/types";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@lib/apiFetch";

export type ProfileStats = {
    totalGames: number;
    totalHoursPlayed: number;
    completionRate: number;
    averageRating: number | null;
    mostPlayedGenre: string | null;
    totalSpent: number | null;
};

export type ProfileGame = {
    _id: string;
    title: string;
    status: StatusType | null;
    genre: string | null;
    rating: number | null;
    hours_played: number | null;
    cover_url: string | null;
};

export type UserProfileType = {
    first_name: string;
    last_name: string;
    bio: string | null;
    created_at: string;
    stats: ProfileStats;
    currentlyPlaying: ProfileGame[];
    completed: ProfileGame[];
    recentlyAdded: ProfileGame[];
};

export const useUserProfile = () => {
    const { currentUser } = useUserContext();
    const userId = currentUser?._id;

    const { data, isLoading, error } = useQuery({
        queryKey: ["user-profile", userId],
        queryFn: () => {
            return apiFetch<UserProfileType>(`/user/${userId}/profile`);
        },
        enabled: !!userId,
    });

    return {
        profile: data,
        isLoading,
        error: error ? "Could not load your profile." : null,
    };
};
