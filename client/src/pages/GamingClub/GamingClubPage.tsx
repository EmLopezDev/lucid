import SearchInput from "@components/SearchInput/SearchInput";
import Button from "@components/Button/Button";
import { useGamingClubPageContext } from "./useGamingClubPageContext";
import { GamingClubPageProvider } from "./GamingClubPageContext";
import { useUserContext } from "@contexts/UserContext/useUserContext";

const GamingClubPageContent = () => {
    const { clubData } = useGamingClubPageContext();
    const { currentUser } = useUserContext();

    const joinButton = (members: string[]) => {
        if (currentUser && members.includes(currentUser._id)) {
            return (
                <Button
                    icon="check"
                    iconPosition="left"
                    buttonSize="small"
                >
                    Joined
                </Button>
            );
        } else {
            return <Button buttonSize="small">Join</Button>;
        }
    };

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
                <SearchInput<string>
                    query=""
                    results={[]}
                    isLoading={false}
                    onSelect={() => {}}
                    onReset={() => {}}
                    onQueryChange={() => {}}
                    renderResult={(result) => {
                        <div>{result}</div>;
                    }}
                    getKey={(result) => result}
                    getLabel={(result) => result}
                    placeholder="Search for a club..."
                />
            </div>
            <div className="gaming-club__cards">
                {clubData.map((club) => (
                    <article className="club-card">
                        <div className="club-card__banner">
                            {club.current_game?.cover_url ? (
                                <img
                                    className="club-card__image"
                                    src={club.current_game?.cover_url}
                                    alt=""
                                />
                            ) : (
                                <div className="club-card__gradient"></div>
                            )}
                        </div>
                        <div className="club-card__content">
                            <div className="club-card__avatar">🎮</div>
                            <h3 className="club-card__name">{club.name}</h3>
                            <span>{club.current_game?.title ?? "-"}</span>
                            <span>{`${club.past_games.length} games completed`}</span>
                            <span>{`${club.members.length} members`}</span>
                            {joinButton(club.members)}
                        </div>
                    </article>
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
