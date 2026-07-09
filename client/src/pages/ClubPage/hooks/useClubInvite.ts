import { useCallback, useState } from "react";
import { useClubPageContext } from "./useClubPageContext";
import { type ClubDetailType } from "@lucid/types";
import { API_URL } from "@config/api";
import { toast } from "sonner";
import { formatInviteExpiry } from "@lib/date";

const useClubInvite = () => {
    const { clubId, clubData, setClubData, onOpenModal, onCloseModal } = useClubPageContext();
    const [isConfirmingRegenerate, setIsConfirmingRegenerate] = useState(false);
    const [isRegeneratingInvite, setIsRegeneratingInvite] = useState(false);

    const inviteUrl = clubData?.invite_code
        ? `${window.location.origin}/clubs/${clubId}/invite?code=${clubData.invite_code}`
        : null;
    const inviteExpiry = formatInviteExpiry(clubData?.invite_code_expires_at ?? null);

    const handleOpenInviteModal = useCallback(() => {
        onOpenModal("inviteCode");
    }, [onOpenModal]);

    const handleCopyInviteLink = useCallback(async () => {
        if (!inviteUrl) return;
        await navigator.clipboard.writeText(inviteUrl);
        toast.success("Invite link copied.");
    }, [inviteUrl]);

    const handleRequestRegenerate = useCallback(() => {
        onCloseModal();
        setIsConfirmingRegenerate(true);
    }, [onCloseModal]);

    const handleCancelRegenerate = useCallback(() => {
        setIsConfirmingRegenerate(false);
        onOpenModal("inviteCode");
    }, [onOpenModal]);

    const handleConfirmRegenerate = useCallback(async () => {
        try {
            setIsRegeneratingInvite(true);
            const response = await fetch(`${API_URL}/clubs/${clubId}/invite/regenerate`, {
                method: "PATCH",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to regenerate invite code");
            const updated: ClubDetailType = await response.json();
            setClubData(updated);
            setIsConfirmingRegenerate(false);
            onOpenModal("inviteCode");
            toast.success("Invite link regenerated.");
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error(error instanceof Error ? error.message : error);
            }
            toast.error("Unable to regenerate invite link, try again.");
        } finally {
            setIsRegeneratingInvite(false);
        }
    }, [clubId, setClubData, onOpenModal]);

    const handleCloseInviteModal = useCallback(() => {
        onCloseModal();
    }, [onCloseModal]);

    return {
        inviteUrl,
        inviteExpiry,
        isConfirmingRegenerate,
        isRegeneratingInvite,
        handleOpenInviteModal,
        handleCopyInviteLink,
        handleRequestRegenerate,
        handleCancelRegenerate,
        handleConfirmRegenerate,
        handleCloseInviteModal,
    };
};

export default useClubInvite;
