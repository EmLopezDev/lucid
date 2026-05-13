import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/HomePage/HomePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import AppLayout from "./layouts/AppLayout";
import AppAuthLayout from "./layouts/AppAuthLayout";
import UserLibraryPage from "./pages/UserLibraryPage/UserLibraryPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import AuthorizedRoutes from "./routes/AuthorizedRoutes";
import { useUserContext } from "./contexts/UserContext/useUserContext";
import AppSkeleton from "./components/Skeleton/AppSkeleton";
import AccountSettingsPage from "./pages/AccountSettingsPage/AccountSettingsPage";
import ProfileView from "./pages/AccountSettingsPage/views/ProfileView/ProfileView";
import PasswordView from "./pages/AccountSettingsPage/views/PasswordView/PasswordView";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage";

function App() {
    const { isUserAuthenticated, isSessionLoading } = useUserContext();

    if (isSessionLoading) {
        return <AppSkeleton />;
    }

    return (
        <Routes>
            <Route element={<AppLayout isUserAuthenticated={isUserAuthenticated} />}>
                <Route
                    path="/"
                    index
                    element={<HomePage />}
                />
                <Route element={<AppAuthLayout isAuthenticated={isUserAuthenticated} />}>
                    <Route
                        path="/register"
                        element={<RegisterPage />}
                    />
                    <Route
                        path="/signin"
                        element={<SignInPage />}
                    />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPasswordPage />}
                    />
                    <Route
                        path="reset-password"
                        element={<ResetPasswordPage />}
                    />
                </Route>
                <Route element={<AuthorizedRoutes isAuthenticated={isUserAuthenticated} />}>
                    <Route
                        path="/user/library"
                        element={<UserLibraryPage />}
                    />
                    <Route
                        path="/user/dashboard"
                        element={<DashboardPage />}
                    />
                    <Route
                        path="/user/settings"
                        element={<AccountSettingsPage />}
                    >
                        <Route
                            index
                            element={
                                <Navigate
                                    to="profile"
                                    replace
                                />
                            }
                        />
                        <Route
                            path="profile"
                            element={<ProfileView />}
                        />
                        <Route
                            path="password"
                            element={<PasswordView />}
                        />
                    </Route>
                </Route>
                <Route
                    path="*"
                    element={<NotFoundPage />}
                />
            </Route>
        </Routes>
    );
}

export default App;
