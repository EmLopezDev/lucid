import { useGamingClubPageContext } from "./useGamingClubPageContext";
import { GamingClubPageProvider } from "./GamingClubPageContext";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import Input from "@components/Input/Input";
import Button from "@components/Button/Button";
import ClubCard from "@components/ClubCard";
import { SkeletonCard } from "@components/Skeleton";

const GamingClubPageContent = () => {
    const { isLoading, clubData } = useGamingClubPageContext();
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
            {isLoading ? (
                <div className="gaming-club__cards">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : !clubData.length ? (
                <div className="gaming-club__empty-state">
                    <span className="gaming-club__empty-state__icon">🎮</span>
                    <span className="gaming-club__empty-state__title">No Clubs Yet</span>
                    <p className="gaming-club__empty-state__sub">Be the first to create one</p>
                    <Button
                        icon="plus"
                        iconPosition="left"
                    >
                        Create Club
                    </Button>
                </div>
            ) : (
                <>
                    <div className="gaming-club__search">
                        <Input
                            placeholder="Search..."
                            onChange={() => {}}
                        />
                    </div>
                    <div className="gaming-club__cards">
                        {clubData.map((club) => (
                            <ClubCard
                                key={club._id}
                                club={club}
                                currentUser={currentUser}
                            />
                        ))}
                    </div>
                </>
            )}
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
