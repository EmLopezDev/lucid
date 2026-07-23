import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useClubPageContext } from "./useClubPageContext";
import { type ClubDetailType } from "@lucid/types";
import { API_URL } from "@config/api";
import { toast } from "sonner";
import { formatInviteExpiry } from "@lib/date";

const useClubInvite = () => {
    const { clubId, clubData, setClubData, onOpenModal, onCloseModal } = useClubPageContext();
    const [isConfirmingRegenerate, setIsConfirmingRegenerate] = useState(false);

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

    const regenerateInviteMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${API_URL}/clubs/${clubId}/invite/regenerate`, {
                method: "PATCH",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to regenerate invite code");
            return (await response.json()) as ClubDetailType;
        },
        meta: {
            successMessage: "Invite link regenerated.",
            errorMessage: "Unable to regenerate invite link, try again.",
        },
        onSuccess: (updated) => {
            setClubData(updated);
            setIsConfirmingRegenerate(false);
            onOpenModal("inviteCode");
        },
    });

    const handleConfirmRegenerate = useCallback(() => {
        regenerateInviteMutation.mutate();
    }, [regenerateInviteMutation]);

    const handleCloseInviteModal = useCallback(() => {
        onCloseModal();
    }, [onCloseModal]);

    return {
        inviteUrl,
        inviteExpiry,
        isConfirmingRegenerate,
        isRegeneratingInvite: regenerateInviteMutation.isPending,
        handleOpenInviteModal,
        handleCopyInviteLink,
        handleRequestRegenerate,
        handleCancelRegenerate,
        handleConfirmRegenerate,
        handleCloseInviteModal,
    };
};

export default useClubInvite;
