import { Outlet } from "react-router";
import { Link } from "react-router";

function AppLayout() {
    return (
        <div className="app-layout">
            <nav className="app-layout__nav">
                <Link
                    className="app-layout__header-nav-title"
                    to="/"
                >
                    LUCID
                </Link>
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
            </nav>
            <main className="app-layout__outlet">
                <Outlet />
            </main>
        </div>
    );
}

export default AppLayout;
