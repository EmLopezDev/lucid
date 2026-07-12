import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ComponentType, type ReactNode } from "react";
import { createAppMutationCache } from "../lib/queryClient";

// Shares the same MutationCache (error/success toast handling) as main.tsx,
// so tests exercise the real behavior instead of a hand-copied stand-in that
// can silently drift out of sync with production.
export const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
        mutationCache: createAppMutationCache(),
    });

// Builds a fresh QueryClient per mount (not per call to this function), so
// separate renderHook()/render() calls sharing the same `wrapper` reference
// never leak cached query data between tests.
export const createQueryWrapper = (Provider: ComponentType<{ children: ReactNode }>) => {
    return ({ children }: { children: ReactNode }) => {
        const [queryClient] = useState(createTestQueryClient);
        return (
            <QueryClientProvider client={queryClient}>
                <Provider>{children}</Provider>
            </QueryClientProvider>
        );
    };
};
