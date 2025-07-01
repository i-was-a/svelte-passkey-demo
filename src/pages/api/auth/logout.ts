import type { APIRoute } from 'astro';
import { handleLogout } from '../../../lib/auth-utils';
import { InMemorySessionAdapter } from '../../../lib/adapters/in-memory-session-adapter';

const sessionAdapter = new InMemorySessionAdapter();

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const sessionId = cookies.get('session_id')?.value;
    if (sessionId) {
      await handleLogout({ sessionId, sessionAdapter });
      cookies.delete('session_id', { path: '/' }); // Remove cookie from browser
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};