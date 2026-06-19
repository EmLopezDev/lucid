import { useClubPageContext } from "./useClubPageContext";
import Button from "@components/Button/Button";
import Icon from "@components/Icon";

const ClubPageOverviewTab = () => {
    const { clubData, isOwner } = useClubPageContext();

    if (!clubData) return null;

    return (
        <div
            className="club-page__panel"
            role="tabpanel"
        >
            <div className="club-page__overview-layout">
                <div className="club-page__main">
                    <section className="club-page__section">
                        <h2 className="club-page__section-title">Now Playing</h2>
                        {clubData.current_game ? (
                            <div className="club-page__current-game">
                                <div className="club-page__current-game-cover">
                                    {clubData.current_game.cover_url ? (
                                        <img
                                            src={clubData.current_game.cover_url}
                                            alt={clubData.current_game.title}
                                        />
                                    ) : (
                                        <div className="club-page__cover-placeholder" />
                                    )}
                                </div>
                                <div className="club-page__current-game-body">
                                    <span
                                        className="club-page__pulse-dot"
                                        aria-hidden="true"
                                    />
                                    <h3 className="club-page__current-game-title">
                                        {clubData.current_game.title}
                                    </h3>
                                    {clubData.current_game.start_date && (
                                        <p className="club-page__current-game-date">
                                            <Icon
                                                name="calendar"
                                                size="small"
                                                color="muted"
                                            />
                                            {clubData.current_game.start_date}
                                        </p>
                                    )}
                                    {isOwner && (
                                        <Button
                                            variant="outline"
                                            buttonSize="small"
                                        >
                                            Change Game
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="club-page__no-game">
                                <Icon
                                    name="loader"
                                    size="large"
                                    color="muted"
                                />
                                <p className="club-page__no-game-text">No game set yet</p>
                                {isOwner && (
                                    <Button
                                        variant="primary"
                                        buttonSize="small"
                                    >
                                        Set a Game
                                    </Button>
                                )}
                            </div>
                        )}
                    </section>

                    <section className="club-page__section">
                        <h2 className="club-page__section-title">Game History</h2>
                        {clubData.past_games.length > 0 ? (
                            <ul className="club-page__history-list">
                                {clubData.past_games.map((game, i) => (
                                    <li
                                        key={i}
                                        className="club-page__history-item"
                                    >
                                        <div className="club-page__history-cover">
                                            {game.cover_url ? (
                                                <img
                                                    src={game.cover_url}
                                                    alt={game.title}
                                                />
                                            ) : (
                                                <div className="club-page__cover-placeholder" />
                                            )}
                                        </div>
                                        <div className="club-page__history-body">
                                            <span className="club-page__history-title">
                                                {game.title}
                                            </span>
                                            <span className="club-page__history-date">
                                                <Icon
                                                    name="calendar"
                                                    size="x-small"
                                                    color="muted"
                                                />
                                                {game.end_date}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="club-page__history-empty">
                                <p>No games completed yet</p>
                            </div>
                        )}
                    </section>

                </div>

                <aside className="club-page__sidebar">
                    <section className="club-page__section">
                        <h2 className="club-page__section-title">Stats</h2>
                        <div className="club-page__stats-grid">
                            <div className="club-page__stat-item">
                                <span className="club-page__stat-value">
                                    {clubData.members.length}
                                </span>
                                <span className="club-page__stat-label">Members</span>
                            </div>
                            <div className="club-page__stat-item">
                                <span className="club-page__stat-value">
                                    {clubData.past_games.length}
                                </span>
                                <span className="club-page__stat-label">Games</span>
                            </div>
                            <div className="club-page__stat-item">
                                <span className="club-page__stat-value">0</span>
                                <span className="club-page__stat-label">Posts</span>
                            </div>
                            <div className="club-page__stat-item">
                                <span className="club-page__stat-value">
                                    {clubData.visibility === "private" ? "Private" : "Public"}
                                </span>
                                <span className="club-page__stat-label">Visibility</span>
                            </div>
                        </div>
                    </section>

                    <section className="club-page__section">
                        <h2 className="club-page__section-title">About</h2>
                        {clubData.description ? (
                            <p className="club-page__description">{clubData.description}</p>
                        ) : (
                            <p className="club-page__description club-page__description--empty">
                                No description added yet.
                            </p>
                        )}
                    </section>

                    {isOwner && (
                        <section className="club-page__section club-page__section--danger">
                            <h2 className="club-page__section-title club-page__section-title--danger">
                                Danger Zone
                            </h2>
                            <p className="club-page__danger-desc">
                                Permanently delete this club and all its data.
                            </p>
                            <Button
                                variant="danger"
                                buttonSize="small"
                            >
                                Delete Club
                            </Button>
                        </section>
                    )}

                </aside>

            </div>
        </div>
    );
};

export default ClubPageOverviewTab;
