export interface Authenticator {
    credentialID: string;
    credentialPublicKey: Buffer;
    counter: number;
    credentialDeviceType: string;
    credentialBackedUp: boolean;
    transports: string[];
    userId: string;
}
export interface User {
    id: string;
    authenticators: Authenticator[];
}
/**
 * The adapter that the library user needs to implement to interact with their database.
 */
export interface StorageAdapter {
    getUser(userHandle: string): Promise<User | null>;
    createUser(): Promise<User>;
    getAuthenticator(credentialID: string): Promise<Authenticator | null>;
    saveAuthenticator(authenticator: Authenticator): Promise<void>;
    updateAuthenticatorCounter(credentialID: string, newCounter: number): Promise<void>;
    linkAuthenticatorToUser(userHandle: string, authenticator: Authenticator): Promise<void>;
}
/**
 * The adapter for handling session storage (e.g., Redis).
 */
export interface SessionAdapter {
    getSession(sessionId: string): Promise<string | null>;
    setSession(sessionId: string, userHandle: string): Promise<void>;
    deleteSession(sessionId: string): Promise<void>;
}
