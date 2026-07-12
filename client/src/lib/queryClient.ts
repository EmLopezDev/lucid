import { MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";

// Shared between main.tsx (production) and the test createQueryWrapper, so
// error/success toast behavior can never drift between the two - only
// retry/staleness defaults should differ between test and production.
export const createAppMutationCache = () =>
    new MutationCache({
        onError: (error, _variables, _context, mutation) => {
            if (import.meta.env.DEV) {
                console.error(error instanceof Error ? error.message : error);
            }
            toast.error(mutation.meta?.errorMessage ?? "Something went wrong, try again.");
        },
        onSuccess: (_data, _variables, _context, mutation) => {
            // Only fires for mutations that opt in with a fixed message via
            // meta - mutations needing a dynamic, result-dependent message
            // (e.g. including a club/member name) keep firing their own
            // toast.success from their local onSuccess callback instead.
            if (mutation.meta?.successMessage) {
                toast.success(mutation.meta.successMessage);
            }
        },
    });
