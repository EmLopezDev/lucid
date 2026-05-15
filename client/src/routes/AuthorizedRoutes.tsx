import { Navigate, Outlet } from "react-router";
import { UserLibraryProvider } from "@contexts/UserLibraryContext/UserLibraryContext";

type AuthorizedRoutesType = {
    isAuthenticated?: boolean;
};

const AuthorizedRoutes = ({ isAuthenticated = false }: AuthorizedRoutesType) => {
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }
    return (
        <UserLibraryProvider>
            <Outlet />
        </UserLibraryProvider>
    );
};

export default AuthorizedRoutes;
