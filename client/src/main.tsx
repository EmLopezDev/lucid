import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { UserProvider } from "./contexts/UserContext/UserContext.tsx";
import App from "./App.tsx";
import "./scss/style.scss";

const root = document.getElementById("root");

createRoot(root!).render(
    <BrowserRouter>
        <StrictMode>
            <UserProvider>
                <App />
            </UserProvider>
        </StrictMode>
    </BrowserRouter>,
);
