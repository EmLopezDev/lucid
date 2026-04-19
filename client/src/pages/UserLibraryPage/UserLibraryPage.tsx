import UserLibraryMockData from "../../data/UserLibraryMockData";
import Card from "../../components/Card/Card";

const UserLibraryPage = () => {
    return (
        <div className="user-library-page">
            <div className="user-library-page__filters">FILTERS GO HERE</div>
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
    );
};

export default UserLibraryPage;
