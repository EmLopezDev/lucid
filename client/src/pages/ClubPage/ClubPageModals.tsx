import { useClubPageContext } from "./hooks/useClubPageContext";
import Modal from "@components/Modal";
import Form from "@components/Form";
import Input from "@components/Input";
import ConfirmModal from "@components/ConfirmModal";
import SetGameForm from "./SetGameForm";
import ChangeGameForm from "./ChangeGameForm";
import useClubGame from "./hooks/useClubGame";
import useClubMembers from "./hooks/useClubMembers";
import useClubSettings from "./hooks/useClubSettings";

const ClubPageModals = () => {
    const { clubData, activeModal, onCloseModal } = useClubPageContext();
    const { onLeaveClub, onRemoveMember } = useClubMembers();
    const { onGameSet, onGameChange } = useClubGame();
    const { onClubDelete } = useClubSettings();

    if (!clubData) return null;

    return (
        <>
            {/* Edit Club */}
            <Modal
                isOpen={activeModal === "editClub"}
                title="Edit Club"
                onClose={onCloseModal}
            >
                <Form
                    primaryButtonText="Save Changes"
                    onSubmit={() => {}}
                    onCancel={onCloseModal}
                >
                    <Input onChange={() => {}} />
                </Form>
            </Modal>

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
