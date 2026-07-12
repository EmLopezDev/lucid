import "./services/sentry";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { UserProvider } from "./contexts/UserContext/UserContext.tsx";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createAppMutationCache } from "./lib/queryClient.ts";
import ErrorFallback from "./components/ErrorFallback/ErrorFallback.tsx";
import App from "./App.tsx";
import * as Sentry from "@sentry/react";
import "./scss/style.scss";

const root = document.getElementById("root");

const queryClient = new QueryClient({
    mutationCache: createAppMutationCache(),
});

createRoot(root!).render(
    <BrowserRouter>
        <StrictMode>
            <Sentry.ErrorBoundary
                fallback={({ resetError }) => <ErrorFallback resetError={resetError} />}
            >
                <QueryClientProvider client={queryClient}>
                    <UserProvider>
                        <Toaster
                            richColors
                            position="bottom-right"
                        />
                        <App />
                    </UserProvider>
                    <ReactQueryDevtools />
                </QueryClientProvider>
            </Sentry.ErrorBoundary>
        </StrictMode>
    </BrowserRouter>,
);
