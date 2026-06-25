import { useClubPageContext } from "./useClubPageContext";

const useClubSettings = () => {
    const { onOpenModal } = useClubPageContext();

    const handleOpenEditClubModal = () => onOpenModal("editClub");

    const onClubEdit = async () => {};

    const onClubDelete = async () => {};

    return { onClubEdit, onClubDelete, handleOpenEditClubModal };
};

export default useClubSettings;
