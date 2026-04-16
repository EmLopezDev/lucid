import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage/HomePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import HomeLayout from "./layout/HomeLayout";

function App() {
    return (
        <Routes>
            <Route element={<HomeLayout />}>
                <Route
                    path="/"
                    index
                    element={<HomePage />}
                />
                <Route>
                    <Route
                        path="/register"
                        element={<RegisterPage />}
                    />
                    <Route
                        path="/signin"
                        element={<SignInPage />}
                    />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
