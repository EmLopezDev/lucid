import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Button from "../Button/Button";

type ModalProps = {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
};

const Modal = ({ isOpen, title, onClose, children }: ModalProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="modal__overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <span className="modal__title">{title}</span>
                    <Button
                        icon="close"
                        variant="transparent"
                        buttonSize="small"
                        aria-label="close modal"
                        onClick={onClose}
                    />
                </div>
                <div className="modal__body">{children}</div>
            </div>
        </div>,
        document.body,
    );
};

export default Modal;
