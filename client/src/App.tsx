import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage/HomePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import AppLayout from "./layouts/AppLayout";
import AppContentLayout from "./layouts/AppContentLayout";
import UserLibraryPage from "./pages/UserLibraryPage/UserLibraryPage";
import AuthorizedRoutes from "./routes/AuthorizedRoutes";
import { useUserContext } from "./contexts/UserContext/useUserContext";

function App() {
    const { user, isUserAuthenticated } = useUserContext();
    console.log("USER", user);
    return (
        <Routes>
            <Route element={<AppLayout isUserAuthenticated={isUserAuthenticated} />}>
                <Route
                    path="/"
                    index
                    element={<HomePage />}
                />
                <Route element={<AppContentLayout />}>
                    <Route
                        path="/register"
                        element={<RegisterPage />}
                    />
                    <Route
                        path="/signin"
                        element={<SignInPage />}
                    />
                    <Route element={<AuthorizedRoutes isAuthenticated={isUserAuthenticated} />}>
                        <Route
                            path="/library"
                            element={<UserLibraryPage />}
                        />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
