import { useCallback } from "react";
import { useClubPageContext } from "./useClubPageContext";
import { type ClubDetailType } from "@lucid/types";
import { API_URL } from "@config/api";
import { toast } from "sonner";

const useClubInvite = () => {
    const { clubId, clubData, setClubData, onOpenModal, onCloseModal } = useClubPageContext();

    const inviteUrl = clubData?.invite_code
        ? `${window.location.origin}/clubs/${clubId}/invite?code=${clubData.invite_code}`
        : null;

    const handleOpenInviteModal = useCallback(() => {
        onOpenModal("inviteCode");
    }, [onOpenModal]);

    const handleCopyInviteLink = useCallback(async () => {
        if (!inviteUrl) return;
        await navigator.clipboard.writeText(inviteUrl);
        toast.success("Invite link copied.");
    }, [inviteUrl]);

    const handleRegenerateInviteCode = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/clubs/${clubId}/invite/regenerate`, {
                method: "PATCH",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to regenerate invite code");
            const updated: ClubDetailType = await response.json();
            setClubData(updated);
            toast.success("Invite link regenerated.");
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error(error instanceof Error ? error.message : error);
            }
            toast.error("Unable to regenerate invite link, try again.");
        }
    }, [clubId, setClubData]);

    const handleCloseInviteModal = useCallback(() => {
        onCloseModal();
    }, [onCloseModal]);

    return {
        inviteUrl,
        handleOpenInviteModal,
        handleCopyInviteLink,
        handleRegenerateInviteCode,
        handleCloseInviteModal,
    };
};

export default useClubInvite;
