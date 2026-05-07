import { useCallback, useEffect, useRef, useState } from "react";
import { type UserLibraryDataType, type PatchUserLibraryGameBodyType } from "../../../../packages/types/UserLibrary";
import { objectCopy } from "../../lib/generic";
import { type GameFormData } from "../GameFormFields/GameFormFields";
import CardDetailContent from "./CardDetailContent";
import CardDetailEditContent from "./CardDetailEditContent";
import Button from "../Button/Button";

type CardDetailType = {
    data: UserLibraryDataType;
    handleOnDeleteById: (id: string) => void;
    onPatchGame: (id: string, data: PatchUserLibraryGameBodyType) => Promise<UserLibraryDataType | null>;
    onClose: () => void;
    isExternallyClosing?: boolean;
};

const toPatchBody = (formData: GameFormData): PatchUserLibraryGameBodyType => ({
    title: formData.title,
    genre: formData.genre.value,
    platform: formData.platform.value,
    status: formData.status.value,
    price: formData.price || null,
    date_purchased: formData.datePurchased || null,
    hours_played: formData.hoursPlayed ? Number(formData.hoursPlayed) : null,
    rating: formData.rating ? Number(formData.rating) : null,
    comment: formData.comment || null,
});

const CardDetail = ({ data, handleOnDeleteById, onPatchGame, onClose, isExternallyClosing }: CardDetailType) => {
    const [gameData, setGameData] = useState(objectCopy(data));
    const [editMode, setEditMode] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [prevCardData, setPrevCardData] = useState(data);
    const [prevExternallyClosing, setPrevExternallyClosing] = useState(!!isExternallyClosing);

    if (data !== prevCardData) {
        setPrevCardData(data);
        setGameData(objectCopy(data));
        setEditMode(false);
        setIsClosing(false);
    }

    if (!!isExternallyClosing !== prevExternallyClosing) {
        setPrevExternallyClosing(!!isExternallyClosing);
        if (isExternallyClosing) setIsClosing(true);
    }

    const onSubmitEditForm = useCallback(
        async (formData: GameFormData) => {
            const updated = await onPatchGame(gameData._id, toPatchBody(formData));
            if (updated) {
                setGameData(updated);
                setEditMode(false);
            }
        },
        [gameData._id, onPatchGame],
    );

    const onCancelEditMode = useCallback(() => {
        setEditMode(false);
        setGameData(data);
    }, [data]);

    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 43.7485em)");
        if (!mq.matches || isClosing) return;

        const container = containerRef.current;
        if (!container) return;

        const focusableSelectors = [
            "button:not([disabled])",
            "[href]",
            "input:not([disabled])",
            "select:not([disabled])",
            "textarea:not([disabled])",
            '[tabindex]:not([tabindex="-1"])',
        ].join(", ");

        const getFocusable = () =>
            Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));

        getFocusable()[0]?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;
            const focusable = getFocusable();
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last?.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first?.focus();
                }
            }
        };

        container.addEventListener("keydown", handleKeyDown);
        return () => container.removeEventListener("keydown", handleKeyDown);
    }, [isClosing]);

    const handleCloseCardDetail = useCallback(() => {
        setIsClosing(true);
    }, []);

    const handleAnimationEnd = useCallback(
        (e: React.AnimationEvent<HTMLElement>) => {
            if (e.target !== e.currentTarget || !isClosing) return;
            onClose();
        },
        [isClosing, onClose],
    );

    return (
        <aside
            ref={containerRef}
            className={`card-detail__container${isClosing ? " card-detail__container--closing" : ""}`}
            onAnimationEnd={handleAnimationEnd}
        >
            <div className="card-detail">
                <span className="card-detail__button--close">
                    <Button
                        icon="close"
                        aria-label="close card detail"
                        variant="transparent"
                        buttonSize="small"
                        onClick={handleCloseCardDetail}
                    />
                </span>
                <div className={`card-detail__image card-detail__image--${gameData.status}`}>IMAGE GOES HERE</div>
                <div className="card-detail__content">
                    {editMode ? (
                        <CardDetailEditContent
                            data={gameData}
                            onSubmit={onSubmitEditForm}
                            onCancel={onCancelEditMode}
                        />
                    ) : (
                        <CardDetailContent
                            data={gameData}
                            setEditMode={setEditMode}
                            handleOnDeleteById={handleOnDeleteById}
                        />
                    )}
                </div>
            </div>
        </aside>
    );
};

export default CardDetail;
