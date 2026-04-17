import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage/HomePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import AppLayout from "./layout/AppLayout";
import AppContentLayout from "./layout/AppContentLayout";
import UserLibraryPage from "./pages/UserLibraryPage/UserLibraryPage";
import AuthorizedRoutes from "./routes/AuthorizedRoutes";

function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
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
                    <Route element={<AuthorizedRoutes isAuthenticated={false} />}>
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
