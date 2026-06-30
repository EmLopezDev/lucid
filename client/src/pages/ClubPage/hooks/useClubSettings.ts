import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useClubPageContext } from "./useClubPageContext";
import { API_URL } from "@config/api";

const useClubSettings = () => {
    const navigate = useNavigate();
    const { clubId, onOpenModal, onCloseModal } = useClubPageContext();

    const handleOpenEditClubModal = () => onOpenModal("editClub");

    const handleOpenDeleteClubModal = () => onOpenModal("deleteClub");

    const onClubEdit = async () => {};

    const onClubDelete = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/clubs/${clubId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to delete club");
            onCloseModal();
            navigate("/clubs");
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error(error instanceof Error ? error.message : error);
            }
        }
    }, [clubId, navigate, onCloseModal]);

    return { onClubEdit, onClubDelete, handleOpenEditClubModal, handleOpenDeleteClubModal };
};

export default useClubSettings;
