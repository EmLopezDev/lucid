import { Outlet } from "react-router";

const AppContentLayout = () => {
    return (
        <div className="app-content-layout">
            <Outlet />
        </div>
    );
};

export default AppContentLayout;
