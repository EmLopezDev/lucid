import { useRef } from "react";
import { useNavigate } from "react-router";
import { cx } from "css-variants";
import Button from "@components/Button";
import Badge from "@components/Badge";
import Icon from "@components/Icon";
import { STEAM_CDN, ROW_ONE, ROW_TWO } from "./homePageGames";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import { useInView } from "@hooks/useInView";

function GameCover({ title, id }: { title: string; id: number }) {
    return (
        <img
            className="home-page__cover"
            src={`${STEAM_CDN}/${id}/header.jpg`}
            alt={title}
            loading="eager"
            draggable={false}
        />
    );
}

function HomePage() {
    const navigate = useNavigate();
    const { isUserAuthenticated } = useUserContext();

    const clubsRef = useRef<HTMLDivElement>(null);
    const feature1Ref = useRef<HTMLDivElement>(null);
    const feature2Ref = useRef<HTMLDivElement>(null);
    const feature3Ref = useRef<HTMLDivElement>(null);

    const clubsInView = useInView(clubsRef);
    const feature1InView = useInView(feature1Ref);
    const feature2InView = useInView(feature2Ref);
    const feature3InView = useInView(feature3Ref);

    return (
        <div className="home-page">
            <section className="home-page__hero">
                <div className="home-page__glow" />

                <div className="home-page__hero-content">
                    <div className="home-page__badges">
                        <Badge
                            label="playing"
                            size="medium"
                        />
                        <Badge
                            label="completed"
                            size="medium"
                        />
                        <Badge
                            label="wishlist"
                            size="medium"
                        />
                        <Badge
                            label="paused"
                            size="medium"
                        />
                        <Badge
                            label="dropped"
                            size="medium"
                        />
                    </div>

                    <h1 className="home-page__headline">
                        Track Every Game.
                        <br />
                        <span className="home-page__headline-accent">Own Every Moment.</span>
                    </h1>

                    <p className="home-page__subtitle">
                        Lucid is your personal game library — log what you've played, rate what you
                        love, and never lose track of what's next.
                    </p>

                    {!isUserAuthenticated && (
                        <>
                            <div className="home-page__actions">
                                <Button
                                    buttonSize="large"
                                    onClick={() => navigate("/register")}
                                >
                                    Get Started
                                </Button>
                                <Button
                                    buttonSize="large"
                                    variant="secondary"
                                    onClick={() => navigate("/signin", { state: { demo: true } })}
                                >
                                    Try Demo
                                </Button>
                            </div>
                            <p className="home-page__demo-hint">
                                Demo account: <code>demo@lucid.com</code> / <code>lucid-demo</code>
                            </p>
                        </>
                    )}
                </div>

                <div className="home-page__marquee">
                    <div className="home-page__marquee-row">
                        {[...ROW_ONE, ...ROW_ONE].map((game, i) => (
                            <GameCover
                                key={`r1-${i}`}
                                {...game}
                            />
                        ))}
                    </div>
                    <div className="home-page__marquee-row home-page__marquee-row--reverse">
                        {[...ROW_TWO, ...ROW_TWO].map((game, i) => (
                            <GameCover
                                key={`r2-${i}`}
                                {...game}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="home-page__features">
                <div
                    ref={clubsRef}
                    className={cx({
                        "home-page__clubs-card": true,
                        "is-revealed": clubsInView,
                    })}
                >
                    <div className="home-page__clubs-glow" />
                    <div className="home-page__clubs-icon">
                        <Icon
                            name="users"
                            size="x-large"
                            color="purple"
                        />
                    </div>
                    <div className="home-page__clubs-content">
                        <span className="home-page__clubs-eyebrow">New · Clubs</span>
                        <h3 className="home-page__clubs-title">Play Together, Not Alone</h3>
                        <p className="home-page__clubs-text">
                            Create or join a club, share what you're playing, and see what your
                            friends are grinding through in real time.
                        </p>
                    </div>
                    <Button
                        buttonSize="medium"
                        variant="secondary"
                        icon="arrow-right"
                        iconPosition="right"
                        onClick={() =>
                            navigate(isUserAuthenticated ? "/clubs" : "/register")
                        }
                    >
                        {isUserAuthenticated ? "Explore Clubs" : "Sign Up to Join a Club"}
                    </Button>
                </div>

                <div className="home-page__feature-grid">
                    <div
                        ref={feature1Ref}
                        className={cx({
                            "home-page__feature": true,
                            "is-revealed": feature1InView,
                        })}
                        style={{ transitionDelay: "80ms" }}
                    >
                        <div className="home-page__feature-icon">
                            <Icon
                                name="library"
                                size="large"
                                color="blue"
                            />
                        </div>
                        <h3 className="home-page__feature-title">Your Library, Organized</h3>
                        <p className="home-page__feature-text">
                            Sort games by status — Playing, Completed, Paused, Dropped, or
                            Wishlist. Your backlog, finally under control.
                        </p>
                    </div>
                    <div
                        ref={feature2Ref}
                        className={cx({
                            "home-page__feature": true,
                            "is-revealed": feature2InView,
                        })}
                        style={{ transitionDelay: "160ms" }}
                    >
                        <div className="home-page__feature-icon">
                            <Icon
                                name="star"
                                size="large"
                                color="gold"
                            />
                        </div>
                        <h3 className="home-page__feature-title">Rate & Reflect</h3>
                        <p className="home-page__feature-text">
                            Log hours played, leave a rating, and capture your thoughts while
                            they're fresh.
                        </p>
                    </div>
                    <div
                        ref={feature3Ref}
                        className={cx({
                            "home-page__feature": true,
                            "is-revealed": feature3InView,
                        })}
                        style={{ transitionDelay: "240ms" }}
                    >
                        <div className="home-page__feature-icon">
                            <Icon
                                name="gamepad"
                                size="large"
                                color="teal"
                            />
                        </div>
                        <h3 className="home-page__feature-title">All Your Platforms</h3>
                        <p className="home-page__feature-text">
                            PlayStation, Xbox, Nintendo, PC — every platform you own, tracked in
                            one place.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
