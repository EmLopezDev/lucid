import { useClubPageContext } from "../hooks/useClubPageContext";
import { formatShortDate, formatMonthYear } from "@lib/date";
import Button from "@components/Button/Button";
import Icon from "@components/Icon";
import useClubGame from "../hooks/useClubGame";
import Badge from "@components/Badge";

const ClubPageOverviewTab = () => {
    const { clubData, isOwner, ownerMember } = useClubPageContext();
    const { handleOpenSetGameModal, handleOpenChangeGameModal } = useClubGame();

    if (!clubData) return null;

    return (
        <div
            className="club-page__panel"
            role="tabpanel"
        >
            <div className="club-page__overview-layout">
                {/* Main — left col on desktop */}
                <div className="club-page__main">
                    <section className="club-page__section">
                        <h2 className="club-page__section-title">Current Game</h2>
                        {clubData.current_game ? (
                            <div className="club-page__current-game">
                                <div className="club-page__current-game-inner">
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
                                        <div className="club-page__now-playing">
                                            <span
                                                className="club-page__pulse-dot"
                                                aria-hidden="true"
                                            />
                                            Now Playing
                                        </div>
                                        <h3 className="club-page__current-game-title">
                                            {clubData.current_game.title}
                                        </h3>
                                        {(clubData.current_game.start_date ||
                                            clubData.current_game.end_date) && (
                                            <p className="club-page__current-game-date">
                                                {clubData.current_game.start_date &&
                                                    `Started ${formatShortDate(clubData.current_game.start_date)}`}
                                                {clubData.current_game.start_date &&
                                                    clubData.current_game.end_date &&
                                                    " · "}
                                                {clubData.current_game.end_date &&
                                                    `Ends ${formatShortDate(clubData.current_game.end_date)}`}
                                            </p>
                                        )}
                                    </div>
                                    {isOwner && (
                                        <div className="club-page__current-game-action">
                                            <Button
                                                onClick={handleOpenChangeGameModal}
                                                variant="secondary"
                                            >
                                                Change Game
                                            </Button>
                                        </div>
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
                                        onClick={handleOpenSetGameModal}
                                    >
                                        Set a Game
                                    </Button>
                                )}
                            </div>
                        )}
                    </section>

                    <div className="club-page__divider" />

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
                                                {game.end_date
                                                    ? formatMonthYear(game.end_date)
                                                    : ""}
                                                {game.game_status && (
                                                    <Badge label={game.game_status} />
                                                )}
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

                {/* Sidebar — right col on desktop */}
                <div className="club-page__sidebar">
                    <div className="club-page__about-wrapper">
                        <h2 className="club-page__section-title">About</h2>
                        <div className="club-page__about-card">
                            <div className="club-page__about-row">
                                <Icon
                                    name="eye"
                                    size="small"
                                    color="muted"
                                />
                                <span className="club-page__about-label">Visibility</span>
                                <span className="club-page__about-value">
                                    {clubData.visibility === "private" ? "Private" : "Public"}
                                </span>
                            </div>
                            <div className="club-page__about-row">
                                <Icon
                                    name="users"
                                    size="small"
                                    color="muted"
                                />
                                <span className="club-page__about-label">Owner</span>
                                <span className="club-page__about-value">
                                    {ownerMember
                                        ? `${ownerMember.first_name} ${ownerMember.last_name}`
                                        : clubData.owner}
                                </span>
                            </div>
                            <div className="club-page__about-row">
                                <Icon
                                    name="calendar"
                                    size="small"
                                    color="muted"
                                />
                                <span className="club-page__about-label">Created</span>
                                <span className="club-page__about-value">
                                    {formatMonthYear(clubData.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="club-page__stats-wrapper">
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
                                <span className="club-page__stat-value">
                                    {clubData.posts.length}
                                </span>
                                <span className="club-page__stat-label">Posts</span>
                            </div>
                            <div className="club-page__stat-item">
                                <span className="club-page__stat-value">
                                    {clubData.visibility === "private" ? "Private" : "Public"}
                                </span>
                                <span className="club-page__stat-label">Visibility</span>
                            </div>
                        </div>
                    </div>

                    {isOwner && (
                        <div className="club-page__danger-wrapper">
                            <h2 className="club-page__section-title club-page__section-title--danger">
                                Danger Zone
                            </h2>
                            <div className="club-page__danger-card">
                                <div className="club-page__danger-row">
                                    <p className="club-page__danger-desc">
                                        Permanently delete this club and all its data.
                                    </p>
                                    <Button
                                        variant="danger"
                                        buttonSize="small"
                                    >
                                        Delete Club
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClubPageOverviewTab;
