import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { type ClubDetailType } from "@lucid/types";
import { toast } from "sonner";
import { useClubPageContext } from "./useClubPageContext";
import { apiFetch } from "@lib/apiFetch";

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
        mutationFn: () => {
            return apiFetch<ClubDetailType>(`/clubs/${clubId}/join`, {
                method: "PATCH",
            });
        },
        meta: { errorMessage: "Unable to join club, try again." },
        onSuccess: (joinedClub) => {
            setClubData(joinedClub);
            toast.success(`Joined ${joinedClub.name} successfully.`);
        },
    });

    const leaveClubMutation = useMutation({
        mutationFn: () => {
            return apiFetch<ClubDetailType>(`/clubs/${clubId}/leave`, {
                method: "PATCH",
            });
        },
        meta: { errorMessage: "Unable to leave club, try again." },
        onSuccess: (leftClub) => {
            setClubData(leftClub);
            onCloseModal();
            toast.success(`Left club ${leftClub.name} successfully.`);
        },
    });

    const removeMemberMutation = useMutation({
        mutationFn: () => {
            return apiFetch<ClubDetailType>(`/clubs/${clubId}/members/${pendingMemberId}`, {
                method: "PATCH",
            });
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
