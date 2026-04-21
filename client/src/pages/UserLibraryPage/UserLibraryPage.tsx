import { useState } from "react";
import UserLibraryMockData from "../../data/UserLibraryMockData";
import Card from "../../components/Card/Card";
import CardDetail from "../../components/CardDetail/CardDetail";
import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";
import Input from "../../components/Input/Input";

const UserLibraryPage = () => {
    const [selectedCard, setSelectedCard] = useState<UserLibraryDataType | null>(null);

    const onCardSelect = (id: string) => {
        const [card] = UserLibraryMockData.filter((data) => data._id === id);
        if (!selectedCard) {
            setSelectedCard(card);
        } else if (selectedCard && selectedCard._id !== id) {
            setSelectedCard(card);
        } else {
            setSelectedCard(null);
        }
    };

    return (
        <div className="user-library-page">
            <div className="user-library-page__filters">
                <Input
                    type="search"
                    placeholder="Search library..."
                    onChange={() => {}}
                />
                <select
                    className="user-library-page__filters__select"
                    name="status-filter"
                    id=""
                >
                    <option value="all">All</option>
                    <option value="playing">Playing</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                    <option value="wishlist">Wishlist</option>
                </select>
                <select
                    className="user-library-page__filters__select"
                    name="sort-filter"
                    id=""
                >
                    <option value="recently-played">Recently added</option>
                    <option value="alphabetical">Title A-Z</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price">Highest Price</option>
                </select>
                <div>
                    <button>Tile</button>
                    <button>List</button>
                </div>
            </div>
            <div className="user-library-page__content">
                <div className="user-library-page__content--main-col">
                    <div className="user-library-page__games">
                        {UserLibraryMockData.map((data) => {
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

export default UserLibraryPage;
