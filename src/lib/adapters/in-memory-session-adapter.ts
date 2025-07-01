import type { SessionAdapter } from '../../components/PasskeyAuth/lib/server/adapters/types';

// In-memory session storage for demonstration purposes
const sessions = new Map<string, string>(); // sessionId -> userHandle

export class InMemorySessionAdapter implements SessionAdapter {
    async getSession(sessionId: string): Promise<string | null> {
        return sessions.get(sessionId) || null;
    }

    async setSession(sessionId: string, userHandle: string): Promise<void> {
        sessions.set(sessionId, userHandle);
    }

    async deleteSession(sessionId: string): Promise<void> {
        sessions.delete(sessionId);
    }
}
