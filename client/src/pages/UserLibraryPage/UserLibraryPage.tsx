import Card from "../../components/Card/Card";
import CardDetail from "../../components/CardDetail/CardDetail";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Select from "../../components/Select/Select";
import { UserLibraryPageProvider } from "./UserLibraryPageContext";
import { useUserLibraryPageContext } from "./useUserLibraryPageContext";

const UserLibraryPageContent = () => {
    const {
        filters,
        filteredData,
        selectedCard,
        statusOptions,
        sortOptions,
        onStatusSelect,
        onSortSelect,
        onCardSelect,
        onSearchTitle,
        onDeleteGameById,
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
                    <Select
                        id="status-options"
                        value={filters.statusValue.value}
                        options={statusOptions}
                        onChange={onStatusSelect}
                    />
                    <Select
                        id="sort-options"
                        value={filters.sortValue.value}
                        options={sortOptions}
                        onChange={onSortSelect}
                    />
                </div>
                <div className="user-library-page__add__button">
                    <Button text="add game" />
                </div>
            </div>
            <div className="user-library-page__content">
                {!filteredData.length ? (
                    <div className="user-library-page__content--none">No Games Found</div>
                ) : (
                    <>
                        <div className="user-library-page__content--main-col">
                            <div className="user-library-page__games">
                                {filteredData.map((data) => {
                                    return (
                                        <Card
                                            key={data._id}
                                            data={data}
                                            selectedId={selectedCard?._id || ""}
                                            handleCardSelect={onCardSelect}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                        {selectedCard && (
                            <CardDetail
                                data={selectedCard}
                                handleOnDeleteById={onDeleteGameById}
                            />
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
