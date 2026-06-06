import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/HomePage/HomePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import AppLayout from "./layouts/AppLayout";
import AppAuthLayout from "./layouts/AppAuthLayout";
import UserLibraryPage from "./pages/UserLibraryPage/UserLibraryPage";
import AuthorizedRoutes from "./routes/AuthorizedRoutes";
import { useUserContext } from "./contexts/UserContext/useUserContext";
import AppSkeleton from "./components/Skeleton/AppSkeleton";
import AccountSettingsPage from "./pages/AccountSettingsPage/AccountSettingsPage";
import ProfileView from "./pages/AccountSettingsPage/ProfileView/ProfileView";
import PasswordView from "./pages/AccountSettingsPage/PasswordView/PasswordView";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage/VerifyEmailPage";
import ProfilePage from "@pages/ProfilePage/ProfilePage";
import GamingClub from "@pages/GamingClub/GamingClub";

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
                    <Route
                        path="verify-email"
                        element={<VerifyEmailPage />}
                    />
                </Route>
                <Route element={<AuthorizedRoutes isAuthenticated={isUserAuthenticated} />}>
                    <Route
                        path="/clubs"
                        element={<GamingClub />}
                    />
                    <Route
                        path="/user/library"
                        element={<UserLibraryPage />}
                    />
                    <Route
                        path="/user/profile"
                        element={<ProfilePage />}
                    />
                    <Route
                        path="/user/settings"
                        element={<AccountSettingsPage />}
                    >
                        <Route
                            index
                            element={
                                <Navigate
                                    to="account"
                                    replace
                                />
                            }
                        />
                        <Route
                            path="account"
                            element={<ProfileView />}
                        />
                        <Route
                            path="security"
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
