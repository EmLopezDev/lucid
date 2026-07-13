import { useUserContext } from "@contexts/UserContext/useUserContext";
import { API_URL } from "@config/api";
import { type StatusType } from "@lucid/types";
import { useQuery } from "@tanstack/react-query";

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

    const fetchProfile = async () => {
        const res = await fetch(`${API_URL}/user/${userId}/profile`, {
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load profile");
        return (await res.json()) as UserProfileType;
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ["user-profile", userId],
        queryFn: fetchProfile,
        enabled: !!userId,
    });

    return {
        profile: data,
        isLoading,
        error: error ? "Could not load your profile." : null,
    };
};
