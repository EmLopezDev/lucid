import { API_URL } from "@config/api";
import type { GameSearchResult } from "../../../types/GameSearch";
import { useClubPageContext } from "./useClubPageContext";
import { toast } from "sonner";
import { capitalizeString } from "@lib/string";

const useClubGame = () => {
    const { clubId, onOpenModal, onCloseModal, setClubData } = useClubPageContext();

    const handleOpenSetGameModal = () => onOpenModal("setGame");

    const handleOpenChangeGameModal = () => onOpenModal("changeGame");

    const onGameSet = async (
        game: GameSearchResult,
        startDate: string | null,
        endDate: string | null,
    ) => {
        try {
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
            if (!response.ok) return;
            const updatedClub = await response.json();
            setClubData(updatedClub);
            onCloseModal();
            toast.success(`${capitalizeString(game.title)} has been set as current game`);
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error(error instanceof Error ? error.message : error);
            }
            toast.error("Unable to set game, try again.");
        }
    };

    const onGameChange = async (
        game: GameSearchResult,
        startDate: string | null,
        endDate: string | null,
        gameStatus: "completed" | "dropped",
    ) => {
        try {
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
            if (!response.ok) return;
            const updatedClub = await response.json();
            setClubData(updatedClub);
            onCloseModal();
            toast.success(`Current game was changed to ${capitalizeString(game.title)}`);
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error(error instanceof Error ? error.message : error);
            }
            toast.error("Unable to change game, try again.");
        }
    };

    return { onGameSet, onGameChange, handleOpenSetGameModal, handleOpenChangeGameModal };
};

export default useClubGame;
