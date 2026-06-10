import { Outlet } from "react-router";
import AppNav from "@components/AppNav";

type AppLayoutType = {
    isUserAuthenticated: boolean;
};

function AppLayout({ isUserAuthenticated }: AppLayoutType) {
    return (
        <div className="app-layout">
            <AppNav isUserAuthenticated={isUserAuthenticated} />
            <main className="app-layout__outlet">
                <Outlet />
            </main>
        </div>
    );
}

export default AppLayout;
