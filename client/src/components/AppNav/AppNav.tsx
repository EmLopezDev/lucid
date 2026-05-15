import { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useUserContext } from "@contexts/UserContext/useUserContext";
import Icon from "@components/Icon/Icon";
import GemIcon from "@components/GemIcon/GemIcon";

function AppNav({ isUserAuthenticated }: { isUserAuthenticated: boolean }) {
    const { signOut } = useUserContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMenuClosing, setIsMenuClosing] = useState(false);
    const [prevPathname, setPrevPathname] = useState(location.pathname);

    if (location.pathname !== prevPathname) {
        setPrevPathname(location.pathname);
        if (isMenuOpen && !isMenuClosing) {
            setIsMenuClosing(true);
        }
    }

    const startClose = useCallback(() => {
        if (isMenuOpen && !isMenuClosing) setIsMenuClosing(true);
    }, [isMenuOpen, isMenuClosing]);

    const finishClose = useCallback(() => {
        setIsMenuOpen(false);
        setIsMenuClosing(false);
    }, []);

    useEffect(() => {
        if (!isMenuOpen || isMenuClosing) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") startClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isMenuOpen, isMenuClosing, startClose]);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    const handleSignOut = async () => {
        await signOut();
        navigate("/signin");
    };

    const navLinksClass = [
        "app-layout__nav-links",
        isMenuOpen && !isMenuClosing && "app-layout__nav-links--open",
        isMenuClosing && "app-layout__nav-links--closing",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <>
            {isMenuOpen && (
                <div
                    className={`app-layout__nav-overlay${isMenuClosing ? " app-layout__nav-overlay--closing" : ""}`}
                    onClick={startClose}
                    aria-hidden="true"
                />
            )}
            <nav className="app-layout__nav">
                {/* Brand — always left */}
                <NavLink
                    className="app-layout__brand"
                    to="/"
                >
                    <GemIcon size={22} />
                    LUCID
                </NavLink>

                {/* Page nav links — centered on desktop, hidden on mobile */}
                <div className="app-layout__nav-center">
                    {isUserAuthenticated && (
                        <>
                            <NavLink
                                className="app-layout__nav-link"
                                to="/user/library"
                            >
                                Library
                            </NavLink>
                            <NavLink
                                className="app-layout__nav-link"
                                to="/user/dashboard"
                            >
                                Dashboard
                            </NavLink>
                            <NavLink
                                className="app-layout__nav-link"
                                to="/user/settings"
                            >
                                Settings
                            </NavLink>
                        </>
                    )}
                </div>

                {/* Right — account actions on desktop + hamburger on mobile */}
                <div className="app-layout__nav-right">
                    <div className="app-layout__nav-actions">
                        {!isUserAuthenticated ? (
                            <>
                                <NavLink
                                    className="app-layout__nav-link"
                                    to="/signin"
                                >
                                    Sign In
                                </NavLink>
                                <NavLink
                                    className="app-layout__nav-link"
                                    to="/register"
                                >
                                    Register
                                </NavLink>
                            </>
                        ) : (
                            <button
                                className="app-layout__nav-link app-layout__nav-link--signout"
                                onClick={handleSignOut}
                            >
                                Sign Out
                            </button>
                        )}
                    </div>

                    <button
                        className="app-layout__hamburger"
                        onClick={() => {
                            if (isMenuOpen) {
                                startClose();
                            } else {
                                setIsMenuOpen(true);
                            }
                        }}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMenuOpen && !isMenuClosing}
                    >
                        <Icon
                            name={isMenuOpen && !isMenuClosing ? "close" : "menu"}
                            size="medium"
                        />
                    </button>
                </div>

                {/* Mobile dropdown — all links */}
                <div
                    className={navLinksClass}
                    onAnimationEnd={(e) => {
                        if (e.target === e.currentTarget && isMenuClosing) finishClose();
                    }}
                >
                    {!isUserAuthenticated ? (
                        <>
                            <NavLink
                                className="app-layout__nav-link"
                                to="/signin"
                            >
                                Sign In
                            </NavLink>
                            <NavLink
                                className="app-layout__nav-link"
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
                            <NavLink
                                className="app-layout__nav-link"
                                to="/user/dashboard"
                            >
                                Dashboard
                            </NavLink>
                            <NavLink
                                className="app-layout__nav-link"
                                to="/user/settings"
                            >
                                Settings
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
            </nav>
        </>
    );
}

export default AppNav;
