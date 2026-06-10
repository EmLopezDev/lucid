import { NavLink, Link, Outlet } from "react-router";
import Icon from "@components/Icon";

const AccountSettingsPage = () => {
    return (
        <section className="account-settings-page">
            <aside className="account-settings-page__nav">
                <Link
                    to="/user/profile"
                    className="account-settings-page__back-link"
                >
                    <Icon
                        name="chevron-left"
                        size="medium"
                    />
                    Profile
                </Link>
                <NavLink
                    to="account"
                    className={({ isActive }) =>
                        `account-settings-page__nav-link${isActive ? " account-settings-page__nav-link--active" : ""}`
                    }
                >
                    Account
                </NavLink>
                <NavLink
                    to="security"
                    className={({ isActive }) =>
                        `account-settings-page__nav-link${isActive ? " account-settings-page__nav-link--active" : ""}`
                    }
                >
                    Security
                </NavLink>
            </aside>
            <div className="account-settings-page__content">
                <Outlet />
            </div>
        </section>
    );
};

export default AccountSettingsPage;
