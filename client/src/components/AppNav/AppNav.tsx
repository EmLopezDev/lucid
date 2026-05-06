import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useUserContext } from "../../contexts/UserContext/useUserContext";
import Icon from "../Icon/Icon";
import GemIcon from "../GemIcon/GemIcon";

function AppNav({ isUserAuthenticated }: { isUserAuthenticated: boolean }) {
    const { signOut } = useUserContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [prevPathname, setPrevPathname] = useState(location.pathname);

    // Close on route change — done at render time to avoid cascading effect renders
    if (location.pathname !== prevPathname) {
        setPrevPathname(location.pathname);
        setIsMenuOpen(false);
    }

    // Close on Escape key
    useEffect(() => {
        if (!isMenuOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsMenuOpen(false);
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isMenuOpen]);

    // Lock body scroll while menu is open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMenuOpen]);

    const handleSignOut = async () => {
        await signOut();
        navigate("/signin");
    };

    const close = () => setIsMenuOpen(false);

    return (
        <>
            {isMenuOpen && (
                <div
                    className="app-layout__nav-overlay"
                    onClick={close}
                    aria-hidden="true"
                />
            )}
            <nav className="app-layout__nav">
                <NavLink
                    className="app-layout__brand"
                    to="/"
                >
                    <GemIcon size={22} />
                    LUCID
                </NavLink>

                <div className={`app-layout__nav-links${isMenuOpen ? " app-layout__nav-links--open" : ""}`}>
                    {!isUserAuthenticated ? (
                        <>
                            <NavLink
                                className="app-layout__nav-link"
                                to="/signin"
                            >
                                Sign In
                            </NavLink>
                            <NavLink
                                className="app-layout__nav-link app-layout__nav-link--register"
                                to="/register"
                            >
                                Register
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink
                                className="app-layout__nav-link"
                                to="/user/library"
                            >
                                Library
                            </NavLink>
                            <button
                                className="app-layout__nav-link app-layout__nav-link--signout"
                                onClick={handleSignOut}
                            >
                                Sign Out
                            </button>
                        </>
                    )}
                </div>

                <button
                    className="app-layout__hamburger"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMenuOpen}
                >
                    <Icon name={isMenuOpen ? "close" : "menu"} size="medium" />
                </button>
            </nav>
        </>
    );
}

export default AppNav;
