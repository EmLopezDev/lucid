import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@config/api";
import type { GameSearchResult } from "../../../types/GameSearch";
import { useClubPageContext } from "./useClubPageContext";
import { type ClubDetailType } from "@lucid/types";
import { toast } from "sonner";
import { capitalizeString } from "@lib/string";

type SetGameVariables = {
    game: GameSearchResult;
    startDate: string | null;
    endDate: string | null;
};

type ChangeGameVariables = SetGameVariables & { gameStatus: "completed" | "dropped" };

const useClubGame = () => {
    const { clubId, onOpenModal, onCloseModal, setClubData } = useClubPageContext();

    const handleOpenSetGameModal = () => onOpenModal("setGame");

    const handleOpenChangeGameModal = () => onOpenModal("changeGame");

    const setGameMutation = useMutation({
        mutationFn: async ({ game, startDate, endDate }: SetGameVariables) => {
            const response = await fetch(`${API_URL}/clubs/${clubId}/game`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: game.title,
                    cover_url: game.coverUrl ?? null,
                    start_date: startDate,
                    end_date: endDate,
                }),
            });
            if (!response.ok) throw new Error("Failed to set game");
            return (await response.json()) as ClubDetailType;
        },
        meta: { errorMessage: "Unable to set game, try again." },
        onSuccess: (updatedClub, { game }) => {
            setClubData(updatedClub);
            onCloseModal();
            toast.success(`${capitalizeString(game.title)} has been set as current game`);
        },
    });

    const changeGameMutation = useMutation({
        mutationFn: async ({ game, startDate, endDate, gameStatus }: ChangeGameVariables) => {
            const response = await fetch(`${API_URL}/clubs/${clubId}/game`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: game.title,
                    cover_url: game.coverUrl ?? null,
                    start_date: startDate,
                    end_date: endDate,
                    game_status: gameStatus,
                }),
            });
            if (!response.ok) throw new Error("Failed to change game");
            return (await response.json()) as ClubDetailType;
        },
        meta: { errorMessage: "Unable to change game, try again." },
        onSuccess: (updatedClub, { game }) => {
            setClubData(updatedClub);
            onCloseModal();
            toast.success(`Current game was changed to ${capitalizeString(game.title)}`);
        },
    });

    const onGameSet = useCallback(
        (game: GameSearchResult, startDate: string | null, endDate: string | null) => {
            setGameMutation.mutate({ game, startDate, endDate });
        },
        [setGameMutation],
    );

    const onGameChange = useCallback(
        (
            game: GameSearchResult,
            startDate: string | null,
            endDate: string | null,
            gameStatus: "completed" | "dropped",
        ) => {
            changeGameMutation.mutate({ game, startDate, endDate, gameStatus });
        },
        [changeGameMutation],
    );

    return {
        onGameSet,
        onGameChange,
        isSettingGame: setGameMutation.isPending,
        isChangingGame: changeGameMutation.isPending,
        handleOpenSetGameModal,
        handleOpenChangeGameModal,
    };
};

export default useClubGame;
