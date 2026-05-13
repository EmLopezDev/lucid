import { NavLink, Outlet } from "react-router";

const AccountSettingsPage = () => {
    return (
        <section className="account-settings-page">
            <aside className="account-settings-page__nav">
                <NavLink
                    to="profile"
                    className={({ isActive }) =>
                        `account-settings-page__nav-link${isActive ? " account-settings-page__nav-link--active" : ""}`
                    }
                >
                    Profile
                </NavLink>
                <NavLink
                    to="password"
                    className={({ isActive }) =>
                        `account-settings-page__nav-link${isActive ? " account-settings-page__nav-link--active" : ""}`
                    }
                >
                    Password
                </NavLink>
            </aside>
            <div className="account-settings-page__content">
                <Outlet />
            </div>
        </section>
    );
};

export default AccountSettingsPage;
