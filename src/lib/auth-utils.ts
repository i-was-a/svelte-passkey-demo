import { InMemorySessionAdapter } from './adapters/in-memory-session-adapter';
import { InMemoryStorageAdapter } from './adapters/in-memory-storage-adapter';

interface SessionInfo {
  isLoggedIn: boolean;
  user: { id: string } | null;
}

export async function getSession({
  sessionId,
  sessionAdapter,
  storageAdapter,
}: {
  sessionId: string;
  sessionAdapter: InMemorySessionAdapter;
  storageAdapter: InMemoryStorageAdapter;
}): Promise<SessionInfo> {
  const sessionData = await sessionAdapter.getSession(sessionId);

  if (sessionData) {
    // Assuming sessionData stores the userId directly if logged in
    // Or it could be a JSON string with challenge/userId during registration
    try {
      const parsedSessionData = JSON.parse(sessionData);
      if (parsedSessionData.userId) {
        const user = await storageAdapter.getUser(parsedSessionData.userId);
        if (user) {
          return { isLoggedIn: true, user: { id: user.id } };
        }
      }
    } catch (e) {
      // If it's not JSON, it might be a direct userId
      const user = await storageAdapter.getUser(sessionData);
      if (user) {
        return { isLoggedIn: true, user: { id: user.id } };
      }
    }
  }
  return { isLoggedIn: false, user: null };
}

export async function handleLogout({
  sessionId,
  sessionAdapter,
}: {
  sessionId: string;
  sessionAdapter: InMemorySessionAdapter;
}) {
  await sessionAdapter.deleteSession(sessionId);
}
