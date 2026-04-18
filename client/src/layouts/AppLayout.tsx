import { Outlet } from "react-router";
import { Link } from "react-router";

type AppLayoutType = {
    isUserAuthenticated: boolean;
};

function AppLayout({ isUserAuthenticated }: AppLayoutType) {
    return (
        <div className="app-layout">
            <nav className="app-layout__nav">
                <Link
                    className="app-layout__header-nav-title"
                    to="/"
                >
                    LUCID
                </Link>
                {!isUserAuthenticated ? (
                    <div className="app-layout__nav-auth">
                        <Link
                            className="app-layout__nav-auth-item"
                            to="/signin"
                        >
                            Sign In
                        </Link>
                        <Link
                            className="app-layout__nav-auth-item"
                            to="/register"
                        >
                            Register
                        </Link>
                    </div>
                ) : (
                    <div className="app-layout__nav-auth">
                        <Link
                            className="app-layout__nav-auth-item"
                            to="/library"
                        >
                            Library
                        </Link>
                        {/* TODO: Change Sign out to actually sign a user out */}
                        <Link
                            className="app-layout__nav-auth-item"
                            to="/"
                        >
                            Sign Out
                        </Link>
                    </div>
                )}
            </nav>
            <main className="app-layout__outlet">
                <Outlet />
            </main>
        </div>
    );
}

export default AppLayout;
