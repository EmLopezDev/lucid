import { API_URL } from "@config/api";
import type { GameSearchResult } from "../../../types/GameSearch";
import { useClubPageContext } from "./useClubPageContext";

const useClubGame = () => {
    const { clubId, onOpenModal, onCloseModal, setClubData } = useClubPageContext();

    const handleOpenSetGameModal = () => onOpenModal("setGame");

    const handleOpenChangeGameModal = () => onOpenModal("changeGame");

    const onGameSet = async (
        game: GameSearchResult,
        startDate: string | null,
        endDate: string | null,
    ) => {
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
    };

    const onGameChange = async (
        game: GameSearchResult,
        startDate: string | null,
        endDate: string | null,
        gameStatus: "completed" | "dropped",
    ) => {
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
    };

    return { onGameSet, onGameChange, handleOpenSetGameModal, handleOpenChangeGameModal };
};

export default useClubGame;
