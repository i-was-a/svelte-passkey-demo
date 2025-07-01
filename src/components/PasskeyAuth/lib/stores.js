import { writable } from 'svelte/store';
function createAuthStore() {
    const { subscribe, set, update } = writable({
        isLoggedIn: false,
        userHandle: null,
        error: null,
    });
    return {
        subscribe,
        setLoggedIn: (userHandle) => update(state => ({ ...state, isLoggedIn: true, userHandle, error: null })),
        setLoggedOut: () => update(state => ({ ...state, isLoggedIn: false, userHandle: null, error: null })),
        setError: (error) => update(state => ({ ...state, error })),
        reset: () => set({ isLoggedIn: false, userHandle: null, error: null }),
    };
}
export const authStore = createAuthStore();
