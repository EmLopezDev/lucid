import { useState, useCallback } from "react";
import { cx } from "css-variants";
import GameCard from "@components/GameCard/GameCard";
import CardDetail from "@components/CardDetail/CardDetail";
import Input from "@components/Input/Input";
import Button from "@components/Button/Button";
import Select from "@components/Select/Select";
import Badge from "@components/Badge/Badge";
import Icon from "@components/Icon/Icon";
import Modal from "@components/Modal/Modal";
import ConfirmModal from "@components/ConfirmModal/ConfirmModal";
import AddGameForm from "@components/AddGameForm/AddGameForm";
import { UserLibraryPageProvider } from "./UserLibraryPageContext";
import { useUserLibraryPageContext } from "./useUserLibraryPageContext";
import {
    type StatusFilterType,
    type SortValueType,
    type SortLabelType,
} from "../../types/SelectOptionsTypes";
import { SkeletonLoader, SkeletonCard, SkeletonCardDetail } from "@components/Skeleton";

const UserLibraryPageContent = () => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const {
        isLoading,
        isCardDetailLoading,
        filters,
        filteredData,
        statusCounts,
        selectedCard,
        isDetailClosing,
        statusFilterOptions,
        sortOptions,
        onStatusSelect,
        onSortSelect,
        onCardSelect,
        onSearchTitle,
        handleOnDeleteGameById,
        onCloseCardDetail,
        isAddGameModalOpen,
        onOpenAddGameModal,
        onCloseAddGameModal,
        handleOnAddGame,
        handleOnPatchGame,
    } = useUserLibraryPageContext();

    const renderStatusTrigger = (label: StatusFilterType) => (
        <div className="status-option">
            {label === "all" ? (
                <span className="status-option__label">All</span>
            ) : (
                <Badge
                    label={label}
                    size="medium"
                />
            )}
            <span
                className={cx({
                    badge: true,
                    "badge--medium": true,
                    [`badge__${label}`]: true,
                })}
            >
                {statusCounts[label] ?? 0}
            </span>
        </div>
    );

    const renderStatusOption = (label: StatusFilterType) => (
        <div className="status-option">
            {label === "all" ? (
                <span className="status-option__label">All</span>
            ) : (
                <Badge
                    size="large"
                    label={label}
                />
            )}
            <span
                className={cx({
                    badge: true,
                    "badge--large": true,
                    [`badge__${label}`]: true,
                })}
            >
                {statusCounts[label] ?? 0}
            </span>
        </div>
    );

    const onRequestDelete = useCallback((id: string) => {
        setPendingDeleteId(id);
    }, []);

    const onConfirmDelete = useCallback(async () => {
        if (!pendingDeleteId) return;
        await handleOnDeleteGameById(pendingDeleteId);
        setPendingDeleteId(null);
    }, [pendingDeleteId, handleOnDeleteGameById]);

    const onCancelDelete = useCallback(() => {
        setPendingDeleteId(null);
    }, []);

    const pendingDeleteGame =
        filteredData.find((g) => g._id === pendingDeleteId) ??
        (selectedCard?._id === pendingDeleteId ? selectedCard : null);

    const activeFilterCount =
        (filters.statusValue.value !== "all" ? 1 : 0) +
        (filters.sortValue.value !== "recently" ? 1 : 0);

    return (
        <div className="user-library-page">
            <div className="user-library-page__controls">
                <div className="user-library-page__controls-right">
                    <Input
                        type="search"
                        placeholder="Search..."
                        onChange={onSearchTitle}
                        hasErrorText={false}
                    />
                    {/* Filter toggle — visible on mobile only */}
                    <div className="user-library-page__filter-toggle">
                        <Button
                            icon="sliders"
                            iconPosition="left"
                            variant={activeFilterCount > 0 ? "primary" : "secondary"}
                            onClick={() => setIsFiltersOpen((prev) => !prev)}
                            aria-expanded={isFiltersOpen}
                        >
                            {activeFilterCount > 0 ? `Filters (${activeFilterCount})` : "Filters"}
                        </Button>
                    </div>
                    {/* Filter panel — inline row on desktop, collapsible on mobile */}
                    <div
                        className={cx({
                            "user-library-page__filter-panel": true,
                            "user-library-page__filter-panel--open": isFiltersOpen,
                        })}
                    >
                        <Select<StatusFilterType, StatusFilterType>
                            id="status-options"
                            value={filters.statusValue.value}
                            options={statusFilterOptions}
                            onChange={onStatusSelect}
                            renderOptionsLabel={renderStatusOption}
                            renderTriggerLabel={renderStatusTrigger}
                        />
                        <Select<SortValueType, SortLabelType>
                            id="sort-options"
                            value={filters.sortValue.value}
                            options={sortOptions}
                            onChange={onSortSelect}
                        />
                    </div>
                    <Button
                        icon="plus"
                        iconPosition="left"
                        onClick={onOpenAddGameModal}
                    >
                        Add game
                    </Button>
                </div>
            </div>
            <div className="user-library-page__content">
                {isLoading ? (
                    <div className="user-library-page__content--main-col">
                        <SkeletonLoader label="Loading your library">
                            <div className="user-library-page__games">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        </SkeletonLoader>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="user-library-page__content--none">No Games Found</div>
                ) : (
                    <>
                        <div className="user-library-page__content--main-col">
                            <div className="user-library-page__games">
                                {filteredData.map((data) => (
                                    <GameCard
                                        key={data._id}
                                        data={data}
                                        selectedId={selectedCard?._id || ""}
                                        handleCardSelect={onCardSelect}
                                        handleDelete={onRequestDelete}
                                    />
                                ))}
                            </div>
                        </div>
                        {selectedCard &&
                            (isCardDetailLoading ? (
                                <SkeletonLoader label="Loading game details">
                                    <SkeletonCardDetail />
                                </SkeletonLoader>
                            ) : (
                                <CardDetail
                                    data={selectedCard}
                                    handleOnDeleteById={onRequestDelete}
                                    onPatchGame={handleOnPatchGame}
                                    onClose={onCloseCardDetail}
                                    isExternallyClosing={isDetailClosing}
                                />
                            ))}
                    </>
                )}
            </div>
            <button
                className="user-library-page__fab"
                onClick={onOpenAddGameModal}
                aria-label="Add game"
            >
                <Icon
                    name="plus"
                    size="large"
                />
            </button>
            <Modal
                isOpen={isAddGameModalOpen}
                title="Add Game"
                onClose={onCloseAddGameModal}
            >
                <AddGameForm
                    onSubmit={handleOnAddGame}
                    onCancel={onCloseAddGameModal}
                />
            </Modal>
            <ConfirmModal
                isOpen={pendingDeleteId !== null}
                title="Remove Game"
                message={
                    <>
                        Are you sure you want to remove{" "}
                        <strong>{pendingDeleteGame?.title ?? "this game"}</strong> from your
                        library? This cannot be undone.
                    </>
                }
                confirmLabel="Remove"
                onCancel={onCancelDelete}
                onConfirm={onConfirmDelete}
            />
        </div>
    );
};

const UserLibraryPage = () => {
    return (
        <UserLibraryPageProvider>
            <UserLibraryPageContent />
        </UserLibraryPageProvider>
    );
};

export default UserLibraryPage;
