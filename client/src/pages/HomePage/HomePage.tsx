import { useNavigate } from "react-router";
import Button from "../../components/Button/Button";
import Badge from "../../components/Badge/Badge";
import { STEAM_CDN, ROW_ONE, ROW_TWO } from "./homePageGames";

function GameCover({ title, id }: { title: string; id: number }) {
    return (
        <img
            className="home-page__cover"
            src={`${STEAM_CDN}/${id}/header.jpg`}
            alt={title}
            loading="lazy"
            draggable={false}
        />
    );
}

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <section className="home-page__hero">
                <div className="home-page__glow" />

                <div className="home-page__hero-content">
                    <div className="home-page__badges">
                        <Badge status="playing" size="medium" />
                        <Badge status="completed" size="medium" />
                        <Badge status="wishlist" size="medium" />
                        <Badge status="paused" size="medium" />
                        <Badge status="dropped" size="medium" />
                    </div>

                    <h1 className="home-page__headline">
                        Track Every Game.<br />
                        <span className="home-page__headline-accent">Own Every Moment.</span>
                    </h1>

                    <p className="home-page__subtitle">
                        Lucid is your personal game library — log what you've played, rate what you love, and never lose track of what's next.
                    </p>

                    <div className="home-page__actions">
                        <Button buttonSize="large" onClick={() => navigate("/register")}>
                            Get Started
                        </Button>
                        <Button buttonSize="large" variant="secondary" onClick={() => navigate("/signin", { state: { demo: true } })}>
                            Try Demo
                        </Button>
                    </div>

                    <p className="home-page__demo-hint">
                        Demo account: <code>demo@lucid.com</code> / <code>lucid-demo</code>
                    </p>
                </div>

                <div className="home-page__marquee">
                    <div className="home-page__marquee-row">
                        {[...ROW_ONE, ...ROW_ONE].map((game, i) => (
                            <GameCover key={`r1-${i}`} {...game} />
                        ))}
                    </div>
                    <div className="home-page__marquee-row home-page__marquee-row--reverse">
                        {[...ROW_TWO, ...ROW_TWO].map((game, i) => (
                            <GameCover key={`r2-${i}`} {...game} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="home-page__features">
                <div className="home-page__feature">
                    <span className="home-page__feature-number">01</span>
                    <h3 className="home-page__feature-title">Your Library, Organized</h3>
                    <p className="home-page__feature-text">
                        Sort games by status — Playing, Completed, Paused, Dropped, or Wishlist. Your backlog, finally under control.
                    </p>
                </div>
                <div className="home-page__feature">
                    <span className="home-page__feature-number">02</span>
                    <h3 className="home-page__feature-title">Rate & Reflect</h3>
                    <p className="home-page__feature-text">
                        Log hours played, leave a rating, and capture your thoughts while they're fresh.
                    </p>
                </div>
                <div className="home-page__feature">
                    <span className="home-page__feature-number">03</span>
                    <h3 className="home-page__feature-title">All Your Platforms</h3>
                    <p className="home-page__feature-text">
                        PlayStation, Xbox, Nintendo, PC — every platform you own, tracked in one place.
                    </p>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
