import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { type ClubDetailType } from "@lucid/types";
import { API_URL } from "@config/api";
import { toast } from "sonner";
import { useClubPageContext } from "./useClubPageContext";

const useClubMembers = () => {
    const {
        clubId,
        clubData,
        pendingMemberId,
        setPendingMemberId,
        onOpenModal,
        onCloseModal,
        setClubData,
    } = useClubPageContext();

    const handleOpenLeaveClubModal = () => onOpenModal("leaveClub");
    const handleOpenRemoveMemberModal = (memberId: string) => {
        onOpenModal("removeClubMember");
        setPendingMemberId(memberId);
    };

    const joinClubMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${API_URL}/clubs/${clubId}/join`, {
                method: "PATCH",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to join club");
            return (await response.json()) as ClubDetailType;
        },
        meta: { errorMessage: "Unable to join club, try again." },
        onSuccess: (joinedClub) => {
            setClubData(joinedClub);
            toast.success(`Joined ${joinedClub.name} successfully.`);
        },
    });

    const leaveClubMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${API_URL}/clubs/${clubId}/leave`, {
                method: "PATCH",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to leave club");
            return (await response.json()) as ClubDetailType;
        },
        meta: { errorMessage: "Unable to leave club, try again." },
        onSuccess: (leftClub) => {
            setClubData(leftClub);
            onCloseModal();
            toast.success(`Left club ${leftClub.name} successfully.`);
        },
    });

    const removeMemberMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${API_URL}/clubs/${clubId}/members/${pendingMemberId}`, {
                method: "PATCH",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to remove member");
            return (await response.json()) as ClubDetailType;
        },
        meta: { errorMessage: "Unable to remove member, try again." },
        onSuccess: (removedMemberClub) => {
            const member = clubData?.members.find((m) => m._id === pendingMemberId);
            setClubData(removedMemberClub);
            onCloseModal();
            setPendingMemberId(null);
            toast.success(`Removed ${member?.first_name} ${member?.last_name} from the club.`);
        },
    });

    const onJoinClub = useCallback(() => {
        joinClubMutation.mutate();
    }, [joinClubMutation]);

    const onLeaveClub = useCallback(() => {
        leaveClubMutation.mutate();
    }, [leaveClubMutation]);

    const onRemoveMember = useCallback(() => {
        removeMemberMutation.mutate();
    }, [removeMemberMutation]);

    return {
        onRemoveMember,
        onJoinClub,
        onLeaveClub,
        isJoiningClub: joinClubMutation.isPending,
        isLeavingClub: leaveClubMutation.isPending,
        isRemovingMember: removeMemberMutation.isPending,
        handleOpenLeaveClubModal,
        handleOpenRemoveMemberModal,
    };
};

export default useClubMembers;
