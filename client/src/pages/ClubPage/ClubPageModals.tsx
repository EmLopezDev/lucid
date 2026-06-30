import { useClubPageContext } from "./hooks/useClubPageContext";
import Modal from "@components/Modal";
import ConfirmModal from "@components/ConfirmModal";
import SetGameForm from "./SetGameForm";
import ChangeGameForm from "./ChangeGameForm";
import ClubForm from "./ClubForm";
import useClubGame from "./hooks/useClubGame";
import useClubMembers from "./hooks/useClubMembers";
import useClubSettings from "./hooks/useClubSettings";

const ClubPageModals = () => {
    const { clubData, activeModal, onCloseModal } = useClubPageContext();
    const { onLeaveClub, onRemoveMember } = useClubMembers();
    const { onGameSet, onGameChange } = useClubGame();
    const {
        onClubDelete,
        editFormData,
        editFormErrors,
        onEditNameChange,
        onEditAvatarChange,
        onEditVisibilityChange,
        onEditDescriptionChange,
        onSubmitEditForm,
        handleCloseEditClubModal,
    } = useClubSettings();

    if (!clubData) return null;

    return (
        <>
            {/* Edit Club */}
            <Modal
                isOpen={activeModal === "editClub"}
                title="Edit Club"
                onClose={handleCloseEditClubModal}
            >
                <ClubForm
                    nameValue={editFormData.name}
                    nameError={editFormErrors.name}
                    avatarValue={editFormData.avatar}
                    visibilityValue={editFormData.visibility}
                    descriptionValue={editFormData.description}
                    descriptionError={editFormErrors.description}
                    onNameChange={onEditNameChange}
                    onAvatarChange={onEditAvatarChange}
                    onVisibilityChange={onEditVisibilityChange}
                    onDescriptionChange={onEditDescriptionChange}
                    primaryButtonText="Save Changes"
                    onSubmit={onSubmitEditForm}
                    onCancel={handleCloseEditClubModal}
                />
            </Modal>

            {/* Delete Club */}
            <ConfirmModal
                isOpen={activeModal === "deleteClub"}
                title="Delete Club"
                message={
                    <>
                        This will permanently delete <strong>{clubData.name}</strong> and all its
                        data. This cannot be undone.
                    </>
                }
                confirmLabel="Delete Club"
                variant="danger"
                onConfirm={onClubDelete}
                onCancel={onCloseModal}
            />

            {/* Set Game */}
            <Modal
                isOpen={activeModal === "setGame"}
                title="Set Current Game"
                onClose={onCloseModal}
            >
                <SetGameForm
                    onSubmit={onGameSet}
                    onCancel={onCloseModal}
                />
            </Modal>

            {/* Change Game */}
            <Modal
                isOpen={activeModal === "changeGame"}
                title="Change Current Game"
                onClose={onCloseModal}
            >
                <ChangeGameForm
                    currentGameTitle={clubData.current_game?.title ?? ""}
                    onSubmit={onGameChange}
                    onCancel={onCloseModal}
                />
            </Modal>

            {/* Remove Member */}
            <ConfirmModal
                isOpen={activeModal === "removeClubMember"}
                title="Remove Member"
                message={`Remove this member from ${clubData.name}? They can rejoin if the club is public.`}
                confirmLabel="Remove"
                variant="danger"
                onConfirm={onRemoveMember}
                onCancel={onCloseModal}
            />

            {/* Leave Club */}
            <ConfirmModal
                isOpen={activeModal === "leaveClub"}
                title="Leave club"
                message={`Are you sure you want to leave ${clubData.name}? You can rejoin if the club is public.`}
                confirmLabel="Remove"
                variant="danger"
                onConfirm={onLeaveClub}
                onCancel={onCloseModal}
            />
        </>
    );
};

export default ClubPageModals;
