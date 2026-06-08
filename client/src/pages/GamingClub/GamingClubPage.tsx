import { useGamingClubPageContext } from "./useGamingClubPageContext";
import { GamingClubPageProvider } from "./GamingClubPageContext";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import Input from "@components/Input/Input";
import Button from "@components/Button/Button";
import ClubCard from "@components/ClubCard/ClubCard";

const GamingClubPageContent = () => {
    const { clubData } = useGamingClubPageContext();
    const { currentUser } = useUserContext();

    return (
        <section className="gaming-club">
            <div className="gaming-club__header">
                <h1 className="gaming-club__title">Clubs</h1>
                <span>
                    <Button
                        icon="plus"
                        iconPosition="left"
                    >
                        Create Club
                    </Button>
                </span>
            </div>
            <div className="gaming-club__search">
                <Input
                    placeholder="Search..."
                    onChange={() => {}}
                />
            </div>
            <div className="gaming-club__cards">
                {clubData.map((club) => (
                    <ClubCard
                        club={club}
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </section>
    );
};

const GamingClubPage = () => {
    return (
        <GamingClubPageProvider>
            <GamingClubPageContent />
        </GamingClubPageProvider>
    );
};

export default GamingClubPage;
