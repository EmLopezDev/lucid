import UserLibraryMockData from "../../data/UserLibraryMockData";

const UserLibraryPage = () => {
    return UserLibraryMockData.map((data) => {
        return (
            <div key={data._id}>
                <h3>{data.game_title}</h3>
            </div>
        );
    });
};

export default UserLibraryPage;
