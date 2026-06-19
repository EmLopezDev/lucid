import { useClubPageContext } from "./useClubPageContext";
import Modal from "@components/Modal";
import Form from "@components/Form";
import Input from "@components/Input";
import ConfirmModal from "@components/ConfirmModal";

const ClubPageModals = () => {
    const { clubData, isOwner } = useClubPageContext();

    if (!clubData || !isOwner) return null;

    return (
        <>
            {/* Edit Club */}
            <Modal
                isOpen={false}
                title="Edit Club"
                onClose={() => {}}
            >
                <Form
                    primaryButtonText="Save Changes"
                    onSubmit={() => {}}
                    onCancel={() => {}}
                >
                    <Input onChange={() => {}} />
                </Form>
            </Modal>

            {/* Set Game */}
            <Modal
                isOpen={false}
                title="Set Current Game"
                onClose={() => {}}
            >
                <Form
                    primaryButtonText="Set Game"
                    onSubmit={() => {}}
                    onCancel={() => {}}
                >
                    <Input onChange={() => {}} />
                </Form>
            </Modal>

            {/* Delete Club */}
            <ConfirmModal
                isOpen={false}
                title="Delete Club"
                message={
                    <>
                        This will permanently delete <strong>{clubData.name}</strong> and all its
                        data. This cannot be undone.
                    </>
                }
                confirmLabel="Delete Club"
                variant="danger"
                onConfirm={() => {}}
                onCancel={() => {}}
            />

            {/* Remove Member */}
            <ConfirmModal
                isOpen={false}
                title="Remove Member"
                message={`Remove this member from ${clubData.name}? They can rejoin if the club is public.`}
                confirmLabel="Remove"
                variant="danger"
                onConfirm={() => {}}
                onCancel={() => {}}
            />
        </>
    );
};

export default ClubPageModals;
