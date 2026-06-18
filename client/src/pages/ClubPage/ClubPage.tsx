import { useParams } from "react-router";
import { ClubPageProvider } from "./ClubPageContext";
import { useClubPageContext } from "./useClubPageContext";

const ClubPageContent = () => {
    const { clubData } = useClubPageContext();

    return <div>{clubData?.name}</div>;
};

const ClubPage = () => {
    const { clubId } = useParams();
    if (!clubId) return null;
    return (
        <ClubPageProvider clubId={clubId}>
            <ClubPageContent />
        </ClubPageProvider>
    );
};

export default ClubPage;
