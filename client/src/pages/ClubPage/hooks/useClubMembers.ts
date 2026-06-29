import { useCallback } from "react";
import { type ClubDetailType } from "@lucid/types";
import { API_URL } from "@config/api";
import { toast } from "sonner";
import { useClubPageContext } from "./useClubPageContext";

const useClubMembers = () => {
    const { clubId, onOpenModal, onCloseModal, setClubData } = useClubPageContext();

    const handleOpenLeaveClubModal = () => onOpenModal("leaveClub");
    const handleOpenDeleteMemberModal = () => onOpenModal("deleteClubMember");

    const handleJoinClub = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/clubs/${clubId}/join`, {
                method: "PATCH",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to join club");
            const joinedClub: ClubDetailType = await response.json();
            setClubData(joinedClub);
            toast.success(`Joined ${joinedClub.name} successfully.`);
            return true;
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error(error instanceof Error ? error.message : error);
            }
            toast.error("Unable to join club, try again.");
            return false;
        }
    }, [clubId, setClubData]);

    const handleLeaveClub = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/clubs/${clubId}/leave`, {
                method: "PATCH",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to leave club");
            const leftClub: ClubDetailType = await response.json();
            setClubData(leftClub);
            onCloseModal();
            toast.success(`Left club ${leftClub.name} successfully.`);
            return true;
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error(error instanceof Error ? error.message : error);
            }
            toast.error("Unable to leave club, try again.");
            return false;
        }
    }, [clubId, setClubData, onCloseModal]);

    const onMemberDelete = async () => {};

    return {
        onMemberDelete,
        handleJoinClub,
        handleLeaveClub,
        handleOpenLeaveClubModal,
        handleOpenDeleteMemberModal,
    };
};

export default useClubMembers;
