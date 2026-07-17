import { useCallback, useMemo, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

const fetchLibrary = async (userId: string): Promise<UserLibraryDataType[]> => {
    const res = await fetch(`${API_URL}/user/${userId}/library`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch library");
    return res.json();
};

export const UserLibraryProvider = ({ children }: { children: ReactNode }) => {
    const { currentUser } = useUserContext();
    const queryClient = useQueryClient();
    const queryKey = useMemo(() => ["user-library", currentUser?._id], [currentUser?._id]);

    const { data: libraryData = [], isLoading } = useQuery({
        queryKey,
        queryFn: () => fetchLibrary(currentUser!._id),
        enabled: !!currentUser,
    });

    const addGameMutation = useMutation({
        mutationFn: async (data: PostUserLibraryGameBodyType) => {
            const res = await fetch(`${API_URL}/user/${currentUser?._id}/library`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to add game");
            return (await res.json()) as UserLibraryDataType;
        },
        meta: { errorMessage: "Failed to add game. Please try again." },
        onSuccess: (newGame) => {
            queryClient.setQueryData<UserLibraryDataType[]>(queryKey, (prev = []) => [
                newGame,
                ...prev,
            ]);
            toast.success(`${newGame.title} added to your library`);
        },
    });

    const patchGameMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: PatchUserLibraryGameBodyType }) => {
            const res = await fetch(`${API_URL}/user/${currentUser?._id}/library/${id}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update game");
            return (await res.json()) as UserLibraryDataType;
        },
        meta: { errorMessage: "Failed to update game. Please try again." },
        onSuccess: (updatedGame) => {
            queryClient.setQueryData<UserLibraryDataType[]>(queryKey, (prev = []) =>
                prev.map((d) => (d._id === updatedGame._id ? updatedGame : d)),
            );
            toast.success(`Changes to ${updatedGame.title} have been saved`);
        },
    });

    const deleteGameMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${API_URL}/user/${currentUser?._id}/library/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to delete game");
            return id;
        },
        meta: { errorMessage: "Failed to delete game. Please try again." },
        onSuccess: (id) => {
            const game = libraryData.find((d) => d._id === id);
            queryClient.setQueryData<UserLibraryDataType[]>(queryKey, (prev = []) =>
                prev.filter((d) => d._id !== id),
            );
            toast.success(`${game?.title ?? "Game"} removed from library`);
        },
    });

    const onAddGame = useCallback(
        async (data: PostUserLibraryGameBodyType) => {
            await addGameMutation.mutateAsync(data).catch(() => {});
        },
        [addGameMutation],
    );

    const onPatchGame = useCallback(
        async (id: string, data: PatchUserLibraryGameBodyType) => {
            try {
                return await patchGameMutation.mutateAsync({ id, data });
            } catch {
                return null;
            }
        },
        [patchGameMutation],
    );

    const onDeleteGameById = useCallback(
        async (id: string) => {
            await deleteGameMutation.mutateAsync(id).catch(() => {});
        },
        [deleteGameMutation],
    );

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
