import { Outlet } from "react-router";
import { Link } from "react-router";

function HomeLayout() {
    return (
        <div className="home-layout">
            <nav className="home-layout__nav">
                <Link
                    className="home-layout__header-nav-title"
                    to="/"
                >
                    LUCID
                </Link>
                <div className="home-layout__nav-auth">
                    <Link
                        className="home-layout__nav-auth-item"
                        to="/signin"
                    >
                        Sign In
                    </Link>
                    <Link
                        className="home-layout__nav-auth-item"
                        to="/register"
                    >
                        Register
                    </Link>
                </div>
            </nav>
            <section className="home-layout__outlet">
                <Outlet />
            </section>
        </div>
    );
}

export default HomeLayout;
