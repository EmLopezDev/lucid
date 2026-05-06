import { cx } from "css-variants";
import Card from "../../components/Card/Card";
import CardDetail from "../../components/CardDetail/CardDetail";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Select from "../../components/Select/Select";
import Badge from "../../components/Badge/Badge";
import Modal from "../../components/Modal/Modal";
import AddGameForm from "../../components/AddGameForm/AddGameForm";
import { UserLibraryPageProvider } from "./UserLibraryPageContext";
import { useUserLibraryPageContext } from "./useUserLibraryPageContext";
import {
    type StatusFilterType,
    type SortValueType,
    type SortLabelType,
} from "../../../../packages/types";
import { SkeletonLoader, SkeletonCard, SkeletonCardDetail } from "../../components/Skeleton";

const UserLibraryPageContent = () => {
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
        onDeleteGameById,
        onCloseCardDetail,
        isAddGameModalOpen,
        onOpenAddGameModal,
        onCloseAddGameModal,
        onAddGame,
        onPatchGame,
    } = useUserLibraryPageContext();

    const renderStatusTrigger = (label: StatusFilterType) => (
        <div className="status-option">
            {label === "all" ? (
                <span className="status-option__label">All</span>
            ) : (
                <Badge status={label} size="medium" />
            )}
            <span className={cx({
                badge: true,
                "badge--medium": true,
                [`badge__${label}`]: true,
            })}>
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
                    status={label}
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
                                    <Card
                                        key={data._id}
                                        data={data}
                                        selectedId={selectedCard?._id || ""}
                                        handleCardSelect={onCardSelect}
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
                                    handleOnDeleteById={onDeleteGameById}
                                    onPatchGame={onPatchGame}
                                    onClose={onCloseCardDetail}
                                    isExternallyClosing={isDetailClosing}
                                />
                            ))}
                    </>
                )}
            </div>
            <Modal
                isOpen={isAddGameModalOpen}
                title="Add Game"
                onClose={onCloseAddGameModal}
            >
                <AddGameForm
                    onSubmit={onAddGame}
                    onCancel={onCloseAddGameModal}
                />
            </Modal>
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
