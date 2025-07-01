interface AuthState {
    isLoggedIn: boolean;
    userHandle: string | null;
    error: string | null;
}
export declare const authStore: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<AuthState>, invalidate?: import("svelte/store").Invalidator<AuthState> | undefined) => import("svelte/store").Unsubscriber;
    setLoggedIn: (userHandle: string) => void;
    setLoggedOut: () => void;
    setError: (error: string | null) => void;
    reset: () => void;
};
export {};
