import { Navigate, Outlet } from "react-router";

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
    return <Outlet />;
};

export default AuthorizedRoutes;
