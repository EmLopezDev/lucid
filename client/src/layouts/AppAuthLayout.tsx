import { Outlet } from "react-router";

const AppAuthLayout = () => {
    return (
        <div className="app-auth-layout">
            <Outlet />
        </div>
    );
};

export default AppAuthLayout;
