import { Navigate, Outlet } from "react-router";

type AppAuthLayoutType = {
    isAuthenticated?: boolean;
};

const AppAuthLayout = ({ isAuthenticated = true }: AppAuthLayoutType) => {
    if (isAuthenticated) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }
    return (
        <div className="app-auth-layout">
            <Outlet />
        </div>
    );
};

export default AppAuthLayout;
