import { useClubPageContext } from "./useClubPageContext";

const useClubMembers = () => {
    const { onOpenModal } = useClubPageContext();

    const handleOpenLeaveClubModal = () => onOpenModal("leaveClub");

    const onMemberRemove = async () => {};

    return { onMemberRemove, handleOpenLeaveClubModal };
};

export default useClubMembers;
