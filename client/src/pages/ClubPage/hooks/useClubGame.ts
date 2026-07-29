import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import type { GameSearchResult } from "../../../types/GameSearch";
import { useClubPageContext } from "./useClubPageContext";
import { type ClubDetailType } from "@lucid/types";
import { toast } from "sonner";
import { capitalizeString } from "@lib/string";
import { apiFetch } from "@lib/apiFetch";

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
        mutationFn: ({ game, startDate, endDate }: SetGameVariables) => {
            return apiFetch<ClubDetailType>(`/clubs/${clubId}/game`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: game.title,
                    cover_url: game.coverUrl ?? null,
                    start_date: startDate,
                    end_date: endDate,
                }),
            });
        },
        meta: { errorMessage: "Unable to set game, try again." },
        onSuccess: (updatedClub, { game }) => {
            setClubData(updatedClub);
            onCloseModal();
            toast.success(`${capitalizeString(game.title)} has been set as current game`);
        },
    });

    const changeGameMutation = useMutation({
        mutationFn: ({ game, startDate, endDate, gameStatus }: ChangeGameVariables) => {
            return apiFetch<ClubDetailType>(`/clubs/${clubId}/game`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: game.title,
                    cover_url: game.coverUrl ?? null,
                    start_date: startDate,
                    end_date: endDate,
                    game_status: gameStatus,
                }),
            });
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
