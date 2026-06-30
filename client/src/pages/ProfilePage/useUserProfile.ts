import { useState, useEffect } from "react";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import { API_URL } from "@config/api";
import { type StatusType } from "@lucid/types";

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
    const [profile, setProfile] = useState<UserProfileType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_URL}/user/${userId}/profile`, {
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to load profile");
                const data: UserProfileType = await res.json();
                setProfile(data);
            } catch {
                setError("Could not load your profile.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    return { profile, isLoading, error };
};
