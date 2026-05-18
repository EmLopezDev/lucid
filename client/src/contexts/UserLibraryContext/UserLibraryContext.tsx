import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { UserLibraryContext } from "./useUserLibraryContext";
import type {
    PatchUserLibraryGameBodyType,
    PostUserLibraryGameBodyType,
    UserLibraryDataType,
} from "@lucid/types";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import { API_URL } from "@config/api";
import { toast } from "sonner";

export interface UserLibraryContextType {
    libraryData: UserLibraryDataType[];
    isLoading: boolean;
    onAddGame: (data: PostUserLibraryGameBodyType) => Promise<void>;
    onPatchGame: (
        id: string,
        data: PatchUserLibraryGameBodyType,
    ) => Promise<UserLibraryDataType | null>;
    onDeleteGameById: (id: string) => Promise<void>;
}

export const UserLibraryProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [libraryData, setLibraryData] = useState<UserLibraryDataType[]>([]);

    const { currentUser } = useUserContext();

    const onAddGame = useCallback(
        async (data: PostUserLibraryGameBodyType) => {
            try {
                const response = await fetch(`${API_URL}/user/${currentUser?._id}/library`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (!response.ok) throw new Error("Failed to add game");
                const newGame: UserLibraryDataType = await response.json();
                setLibraryData((prev) => [newGame, ...prev]);
                toast.success(`${newGame.title} added to your library`);
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error(error instanceof Error ? error.message : error);
                }

                toast.error("Failed to add game. Please try again.");
            }
        },
        [currentUser],
    );

    const onPatchGame = useCallback(
        async (
            id: string,
            data: PatchUserLibraryGameBodyType,
        ): Promise<UserLibraryDataType | null> => {
            try {
                const response = await fetch(`${API_URL}/user/${currentUser?._id}/library/${id}`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (!response.ok) throw new Error("Failed to update game");
                const updatedGame: UserLibraryDataType = await response.json();
                setLibraryData((prev) => prev.map((d) => (d._id === id ? updatedGame : d)));
                toast.success(`Changes to ${updatedGame.title} have been saved`);
                return updatedGame;
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error(error instanceof Error ? error.message : error);
                }

                toast.error("Failed to update game. Please try again.");
                return null;
            }
        },
        [currentUser],
    );

    const onDeleteGameById = useCallback(
        async (id: string) => {
            try {
                const game = libraryData.find((d) => d._id === id);
                const response = await fetch(`${API_URL}/user/${currentUser?._id}/library/${id}`, {
                    method: "DELETE",
                    credentials: "include",
                });
                if (!response.ok) throw new Error("Failed to delete game");
                setLibraryData((prev) => prev.filter((d) => d._id !== id));
                toast.success(`${game?.title ?? "Game"} removed from library`);
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error(error instanceof Error ? error.message : error);
                }
                toast.error("Failed to delete game. Please try again.");
            }
        },
        [currentUser, libraryData],
    );

    useEffect(() => {
        const fetchUserLibraryGames = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/user/${currentUser?._id}/library`, {
                    credentials: "include",
                });
                const data = await response.json();
                setLibraryData(data);
            } catch (error) {
                if (import.meta.env.DEV)
                    console.error(error instanceof Error ? error.message : error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserLibraryGames();
    }, [currentUser]);

    const contextValue = useMemo(
        () => ({
            libraryData,
            isLoading,
            onAddGame,
            onPatchGame,
            onDeleteGameById,
        }),
        [libraryData, isLoading, onAddGame, onPatchGame, onDeleteGameById],
    );

    return (
        <UserLibraryContext.Provider value={contextValue}>{children}</UserLibraryContext.Provider>
    );
};
