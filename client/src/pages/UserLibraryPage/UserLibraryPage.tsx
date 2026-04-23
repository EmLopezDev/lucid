import Card from "../../components/Card/Card";
import CardDetail from "../../components/CardDetail/CardDetail";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Select from "../../components/Select/Select";
import { UserLibraryPageProvider } from "./UserLibraryPageContext";
import { useUserLibraryPageContext } from "./useUserLibraryPageContext";

const UserLibraryPageContent = () => {
    const {
        libraryData,
        selectedCard,
        statusValue,
        sortValue,
        statusOptions,
        sortOptions,
        onStatusSelect,
        onSortSelect,
        onCardSelect,
        onSearchTitle,
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
                        value={statusValue.value}
                        options={statusOptions}
                        onChange={onStatusSelect}
                    />
                    <Select
                        id="sort-options"
                        value={sortValue.value}
                        options={sortOptions}
                        onChange={onSortSelect}
                    />
                </div>
                <div className="user-library-page__add__button">
                    <Button text="add game" />
                </div>
            </div>
            <div className="user-library-page__content">
                <div className="user-library-page__content--main-col">
                    <div className="user-library-page__games">
                        {libraryData.map((data) => {
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
                {selectedCard && <CardDetail data={selectedCard} />}
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
