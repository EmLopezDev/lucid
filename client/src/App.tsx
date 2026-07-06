import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router";
import { useUserContext } from "./contexts/UserContext/useUserContext";
import { LazyRoute } from "@components/ProgressBar";
import AppLayout from "./layouts/AppLayout";
import AppAuthLayout from "./layouts/AppAuthLayout";
import AuthorizedRoutes from "./routes/AuthorizedRoutes";
import AppSkeleton from "./components/Skeleton/AppSkeleton";

const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage/RegisterPage"));
const SignInPage = lazy(() => import("./pages/SignInPage/SignInPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage"));
const UserLibraryPage = lazy(() => import("./pages/UserLibraryPage/UserLibraryPage"));
const AccountSettingsPage = lazy(() => import("./pages/AccountSettingsPage/AccountSettingsPage"));
const ProfileView = lazy(() => import("./pages/AccountSettingsPage/ProfileView/ProfileView"));
const PasswordView = lazy(() => import("./pages/AccountSettingsPage/PasswordView/PasswordView"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage/VerifyEmailPage"));
const ProfilePage = lazy(() => import("@pages/ProfilePage/ProfilePage"));
const ClubsListPage = lazy(() => import("@pages/ClubsListPage/ClubsListPage"));
const ClubPage = lazy(() => import("@pages/ClubPage/ClubPage"));
const InvitePage = lazy(() => import("@pages/InvitePage"));

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
                    element={
                        <LazyRoute>
                            <HomePage />
                        </LazyRoute>
                    }
                />
                <Route element={<AppAuthLayout isAuthenticated={isUserAuthenticated} />}>
                    <Route
                        path="/register"
                        element={
                            <LazyRoute>
                                <RegisterPage />
                            </LazyRoute>
                        }
                    />
                    <Route
                        path="/signin"
                        element={
                            <LazyRoute>
                                <SignInPage />
                            </LazyRoute>
                        }
                    />
                    <Route
                        path="/forgot-password"
                        element={
                            <LazyRoute>
                                <ForgotPasswordPage />
                            </LazyRoute>
                        }
                    />
                    <Route
                        path="reset-password"
                        element={
                            <LazyRoute>
                                <ResetPasswordPage />
                            </LazyRoute>
                        }
                    />
                    <Route
                        path="verify-email"
                        element={
                            <LazyRoute>
                                <VerifyEmailPage />
                            </LazyRoute>
                        }
                    />
                </Route>
                <Route
                    path="/clubs/:clubId/invite"
                    element={
                        <LazyRoute>
                            <InvitePage />
                        </LazyRoute>
                    }
                />
                <Route element={<AuthorizedRoutes isAuthenticated={isUserAuthenticated} />}>
                    <Route
                        path="/clubs"
                        element={
                            <LazyRoute>
                                <ClubsListPage />
                            </LazyRoute>
                        }
                    />
                    <Route
                        path="/clubs/:clubId"
                        element={
                            <LazyRoute>
                                <ClubPage />
                            </LazyRoute>
                        }
                    />
                    <Route
                        path="/user/library"
                        element={
                            <LazyRoute>
                                <UserLibraryPage />
                            </LazyRoute>
                        }
                    />
                    <Route
                        path="/user/profile"
                        element={
                            <LazyRoute>
                                <ProfilePage />
                            </LazyRoute>
                        }
                    />
                    <Route
                        path="/user/settings"
                        element={
                            <LazyRoute>
                                <AccountSettingsPage />
                            </LazyRoute>
                        }
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
                            element={
                                <LazyRoute>
                                    <ProfileView />
                                </LazyRoute>
                            }
                        />
                        <Route
                            path="security"
                            element={
                                <LazyRoute>
                                    <PasswordView />
                                </LazyRoute>
                            }
                        />
                    </Route>
                </Route>
                <Route
                    path="*"
                    element={
                        <LazyRoute>
                            <NotFoundPage />
                        </LazyRoute>
                    }
                />
            </Route>
        </Routes>
    );
}

export default App;
