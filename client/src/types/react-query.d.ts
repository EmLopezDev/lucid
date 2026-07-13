import "@tanstack/react-query";

// Types the `meta` object every useMutation call can pass, so the global
// MutationCache handlers (see main.tsx) get typed, autocompleted fields
// instead of an unknown blob.
//
// successMessage is only for FIXED messages that don't depend on the
// mutation's result (e.g. "Club updated successfully."). Mutations whose
// success message needs the response data (e.g. "Joined {club.name}...")
// should keep firing their own toast.success(...) from their local
// onSuccess callback, where the result is still precisely typed - don't
// force those through meta just for consistency.
//
// skipErrorToast opts a mutation out of the global error toast so it can
// fire its own toast.error(...) with a dynamic message (e.g. a validation
// reason from the response body) instead of the generic fallback.
declare module "@tanstack/react-query" {
    interface Register {
        mutationMeta: {
            errorMessage?: string;
            successMessage?: string;
            skipErrorToast?: boolean;
        };
    }
}
