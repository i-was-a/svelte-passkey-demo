import { randomUUID } from 'crypto';

// Type definitions
export interface User {
    id: string;
    authenticators: Authenticator[];
}

export interface Authenticator {
    id: string;
    publicKey: Uint8Array;
    counter: number;
    userId: string;
    transports: string[];
}

export interface StorageAdapter {
    getUser(userHandle: string): Promise<User | null>;
    createUser(): Promise<User>;
    getAuthenticator(credentialID: string): Promise<Authenticator | null>;
    saveAuthenticator(authenticator: Authenticator): Promise<void>;
    updateAuthenticatorCounter(credentialID: string, newCounter: number): Promise<void>;
    linkAuthenticatorToUser(userHandle: string, authenticator: Authenticator): Promise<void>;
    getAllAuthenticators(): Promise<Authenticator[]>;
}

// In-memory storage for demonstration purposes
const users = new Map<string, User>();
const authenticators = new Map<string, Authenticator>();

export class InMemoryStorageAdapter implements StorageAdapter {
    async getUser(userHandle: string): Promise<User | null> {
        return users.get(userHandle) || null;
    }

    async createUser(): Promise<User> {
        const newUser: User = {
            id: randomUUID(),
            authenticators: [],
        };
        users.set(newUser.id, newUser);
        return newUser;
    }

    async getAuthenticator(credentialID: string): Promise<Authenticator | null> {
        return authenticators.get(credentialID) || null;
    }

    async saveAuthenticator(authenticator: Authenticator): Promise<void> {
        authenticators.set(authenticator.id, authenticator);
        const user = users.get(authenticator.userId);
        if (user) {
            user.authenticators.push(authenticator);
            users.set(user.id, user);
        }
    }

    async updateAuthenticatorCounter(credentialID: string, newCounter: number): Promise<void> {
        const authenticator = authenticators.get(credentialID);
        if (authenticator) {
            authenticator.counter = newCounter;
            authenticators.set(credentialID, authenticator);
        }
    }

    async linkAuthenticatorToUser(userHandle: string, authenticator: Authenticator): Promise<void> {
        const user = users.get(userHandle);
        if (user) {
            user.authenticators.push(authenticator);
            users.set(user.id, user);
        }
    }

    async getAllAuthenticators(): Promise<Authenticator[]> {
        return Array.from(authenticators.values());
    }
}
