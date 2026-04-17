import { Outlet } from "react-router";

export const AuthLayout = () => {
    return (
        <div className="auth-layout">
            <Outlet />
        </div>
    );
};
