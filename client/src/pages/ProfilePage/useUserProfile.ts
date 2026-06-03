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
    cover_image: string | null;
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
    const [profile, setProfile] = useState<UserProfileType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!currentUser) return;

        const controller = new AbortController();

        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_URL}/user/${currentUser._id}/profile`, {
                    credentials: "include",
                    signal: controller.signal,
                });
                if (!res.ok) throw new Error("Failed to load profile");
                const data: UserProfileType = await res.json();
                setProfile(data);
            } catch (err) {
                if (err instanceof DOMException && err.name === "AbortError") return;
                setError("Could not load your profile.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();

        return () => controller.abort();
    }, [currentUser]);

    return { profile, isLoading, error };
};
