import { type ReactNode } from "react";
import Modal from "@components/Modal";
import Button from "@components/Button";

type ConfirmModalType = {
    isOpen: boolean;
    title: string;
    message: string | ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "primary";
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

const ConfirmModal = ({
    isOpen,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "danger",
    isLoading = false,
    onConfirm,
    onCancel,
}: ConfirmModalType) => {
    return (
        <Modal
            isOpen={isOpen}
            title={title}
            onClose={onCancel}
            preventClose={isLoading}
        >
            <div className="confirm-modal__message">
                <p>{message}</p>
                <div className="confirm-modal__actions">
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
