import { useClubPageContext } from "./useClubPageContext";

const useClubGame = () => {
    const { onOpenModal } = useClubPageContext();

    const handleOpenSetGameModal = () => onOpenModal("setGame");

    const handleOpenChangeGameModal = () => onOpenModal("changeGame");

    const onGameSet = async () => {};

    const onGameChange = async () => {};

    return { onGameSet, onGameChange, handleOpenSetGameModal, handleOpenChangeGameModal };
};

export default useClubGame;
