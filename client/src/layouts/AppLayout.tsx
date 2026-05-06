import { useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router";
import { useUserContext } from "../contexts/UserContext/useUserContext";
import Icon from "../components/Icon/Icon";
import GemIcon from "../components/GemIcon/GemIcon";

type AppLayoutType = {
    isUserAuthenticated: boolean;
};

function AppLayout({ isUserAuthenticated }: AppLayoutType) {
    const { signOut } = useUserContext();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSignOut = async () => {
        setIsMenuOpen(false);
        await signOut();
        navigate("/signin");
    };

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <div className="app-layout">
            <nav className="app-layout__nav">
                <NavLink
                    className="app-layout__brand"
                    to="/"
                    onClick={closeMenu}
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
                                onClick={closeMenu}
                            >
                                Sign In
                            </NavLink>
                            <NavLink
                                className="app-layout__nav-link app-layout__nav-link--register"
                                to="/register"
                                onClick={closeMenu}
                            >
                                Register
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink
                                className="app-layout__nav-link"
                                to="/user/library"
                                onClick={closeMenu}
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
            <main className="app-layout__outlet">
                <Outlet />
            </main>
        </div>
    );
}

export default AppLayout;
