import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Button from "@components/Button";

type ModalProps = {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
};

const Modal = ({ isOpen, title, onClose, children }: ModalProps) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isClosing, setIsClosing] = useState(false);
    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

    if (isOpen !== prevIsOpen) {
        setPrevIsOpen(isOpen);
        if (isOpen) {
            setShouldRender(true);
            setIsClosing(false);
        } else {
            setIsClosing(true);
        }
    }

    const startClose = useCallback(() => {
        setIsClosing(true);
    }, []);

    const handleAnimationEnd = useCallback(
        (e: React.AnimationEvent<HTMLDivElement>) => {
            if (e.target !== e.currentTarget || !isClosing) return;
            setShouldRender(false);
            setIsClosing(false);
            onClose();
        },
        [isClosing, onClose],
    );

    useEffect(() => {
        if (!shouldRender || isClosing) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") startClose();
        };
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [shouldRender, isClosing, startClose]);

    if (!shouldRender) return null;

    return createPortal(
        <div
            className={`modal__overlay${isClosing ? " modal__overlay--closing" : ""}`}
            onClick={startClose}
        >
            <div
                className={`modal${isClosing ? " modal--closing" : ""}`}
                onClick={(e) => e.stopPropagation()}
                onAnimationEnd={handleAnimationEnd}
            >
                <div className="modal__header">
                    <span className="modal__title">{title}</span>
                    <span className="modal__button">
                        <Button
                            icon="close"
                            variant="transparent"
                            buttonSize="small"
                            aria-label="close modal"
                            onClick={startClose}
                        />
                    </span>
                </div>
                <div className="modal__body">{children}</div>
            </div>
        </div>,
        document.body,
    );
};

export default Modal;
