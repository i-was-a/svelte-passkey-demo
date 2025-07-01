import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth-utils';
import { InMemoryStorageAdapter } from '../../../lib/adapters/in-memory-storage-adapter';
import { InMemorySessionAdapter } from '../../../lib/adapters/in-memory-session-adapter';

const storageAdapter = new InMemoryStorageAdapter();
const sessionAdapter = new InMemorySessionAdapter();

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    const sessionId = cookies.get('session_id')?.value;
    if (!sessionId) {
      return new Response(JSON.stringify({ isLoggedIn: false, user: null }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sessionInfo = await getSession({ sessionId, sessionAdapter, storageAdapter });

    if (sessionInfo.isLoggedIn && sessionInfo.user) {
      return new Response(JSON.stringify({ isLoggedIn: true, user: { id: sessionInfo.user.id } }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Session invalid or user not found, clear cookie
      cookies.delete('session_id', { path: '/' });
      return new Response(JSON.stringify({ isLoggedIn: false, user: null }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error: any) {
    console.error('Session check error:', error);
    cookies.delete('session_id', { path: '/' }); // Ensure cookie is cleared on error
    return new Response(JSON.stringify({ isLoggedIn: false, user: null, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};