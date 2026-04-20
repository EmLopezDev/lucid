import UserLibraryMockData from "../../data/UserLibraryMockData";
import Card from "../../components/Card/Card";

const UserLibraryPage = () => {
    return (
        <div className="user-library-page">
            <div className="user-library-page__filters">
                <input
                    type="search"
                    placeholder="Search library..."
                />
                <select
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
            <div style={{ display: "flex" }}>
                <div style={{ flex: 1 }}>
                    <div className="user-library-page__games">
                        {UserLibraryMockData.map((data) => {
                            return (
                                <Card
                                    key={data._id}
                                    data={data}
                                />
                            );
                        })}
                    </div>
                </div>
                {/* <div style={{ width: "240px" }}>CARD DETAILS</div> */}
            </div>
        </div>
    );
};

export default UserLibraryPage;
