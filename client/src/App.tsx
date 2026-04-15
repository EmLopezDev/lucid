import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage/HomePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import SignInPage from "./pages/SignInPage/SignInPage";

function App() {
    return (
        <Routes>
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
        </Routes>
    );
}

export default App;
