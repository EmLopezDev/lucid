import Card from "../../components/Card/Card";
import CardDetail from "../../components/CardDetail/CardDetail";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Select from "../../components/Select/Select";
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
        selectedCard,
        statusFilterOptions,
        sortOptions,
        onStatusSelect,
        onSortSelect,
        onCardSelect,
        onSearchTitle,
        onDeleteGameById,
        onCloseCardDetail,
    } = useUserLibraryPageContext();
    return (
        <div className="user-library-page">
            <div className="user-library-page__controls">
                <div className="user-library-page__filters">
                    <Input
                        type="search"
                        placeholder="Search library..."
                        onChange={onSearchTitle}
                        hasErrorText={false}
                    />
                    <div className="user-library-page__filters--select">
                        <Select<StatusFilterType, StatusFilterType>
                            id="status-options"
                            value={filters.statusValue.value}
                            options={statusFilterOptions}
                            onChange={onStatusSelect}
                        />
                        <Select<SortValueType, SortLabelType>
                            id="sort-options"
                            value={filters.sortValue.value}
                            options={sortOptions}
                            onChange={onSortSelect}
                        />
                    </div>
                </div>
                <div className="user-library-page__add__button">
                    <Button>Add game</Button>
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
                        {selectedCard && (
                            isCardDetailLoading ? (
                                <SkeletonLoader label="Loading game details">
                                    <SkeletonCardDetail />
                                </SkeletonLoader>
                            ) : (
                                <CardDetail
                                    key={selectedCard._id}
                                    data={selectedCard}
                                    handleOnDeleteById={onDeleteGameById}
                                    onClose={onCloseCardDetail}
                                />
                            )
                        )}
                    </>
                )}
            </div>
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
