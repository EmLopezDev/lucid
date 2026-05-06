import { Outlet, useNavigate } from "react-router";
import { Link } from "react-router";
import { useUserContext } from "../contexts/UserContext/useUserContext";

type AppLayoutType = {
    isUserAuthenticated: boolean;
};

function AppLayout({ isUserAuthenticated }: AppLayoutType) {
    const { signOut } = useUserContext();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate("/signin");
    };

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
                            to="/user/library"
                        >
                            Library
                        </Link>
                        <button
                            className="app-layout__nav-auth-item"
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </button>
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
