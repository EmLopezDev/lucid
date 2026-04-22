import { useState } from "react";
import UserLibraryMockData from "../../data/UserLibraryMockData";
import Card from "../../components/Card/Card";
import CardDetail from "../../components/CardDetail/CardDetail";
import { type UserLibraryDataType } from "../../../../packages/types/UserLibrary";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Select, { type SelectOptionType } from "../../components/Select/Select";

const UserLibraryPage = () => {
    const [selectedCard, setSelectedCard] = useState<UserLibraryDataType | null>(null);
    const [statusValue, setStatusValue] = useState("");
    const [filterValue, setFilterValue] = useState("");

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
    const statusOptions: SelectOptionType[] = [
        { value: "all", label: "all" },
        { value: "playing", label: "playing" },
        { value: "completed", label: "completed" },
        { value: "paused", label: "paused" },
        { value: "wishlist", label: "wishlist" },
    ];

    const filterOptions: SelectOptionType[] = [
        { value: "recently", label: "recently added" },
        { value: "alphabetical", label: "Title A-Z" },
        { value: "rated", label: "Highest Rated" },
        { value: "price", label: "Highest Price" },
    ];

    return (
        <div className="user-library-page">
            <div className="user-library-page__controls">
                <div className="user-library-page__filters">
                    <Input
                        type="search"
                        placeholder="Search library..."
                        onChange={() => {}}
                        hasErrorText={false}
                    />
                    <Select
                        id="status-options"
                        value={statusValue}
                        options={statusOptions}
                        onChange={(e) => setStatusValue(e.target.value)}
                    />
                    <Select
                        id="filter-options"
                        value={filterValue}
                        options={filterOptions}
                        onChange={(e) => setFilterValue(e.target.value)}
                    />
                </div>
                <div className="user-library-page__add__button">
                    <Button text="add game" />
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
