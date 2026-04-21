import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage/HomePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import AppLayout from "./layouts/AppLayout";
import AppAuthLayout from "./layouts/AppAuthLayout";
import UserLibraryPage from "./pages/UserLibraryPage/UserLibraryPage";
import AuthorizedRoutes from "./routes/AuthorizedRoutes";
import { useUserContext } from "./contexts/UserContext/useUserContext";

function App() {
    const { isUserAuthenticated } = useUserContext();
    return (
        <Routes>
            <Route element={<AppLayout isUserAuthenticated={isUserAuthenticated} />}>
                <Route
                    path="/"
                    index
                    element={<HomePage />}
                />
                <Route element={<AppAuthLayout />}>
                    <Route
                        path="/register"
                        element={<RegisterPage />}
                    />
                    <Route
                        path="/signin"
                        element={<SignInPage />}
                    />
                </Route>
                <Route element={<AuthorizedRoutes isAuthenticated={isUserAuthenticated} />}>
                    <Route
                        path="/user/library"
                        element={<UserLibraryPage />}
                    />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
