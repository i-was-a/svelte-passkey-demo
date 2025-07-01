import type { APIRoute } from 'astro';
import { generateAuthenticationOptions } from '../../../lib/simplewebauthn-wrapper';
import { InMemorySessionAdapter } from '../../../lib/adapters/in-memory-session-adapter';
import { InMemoryStorageAdapter } from '../../../lib/adapters/in-memory-storage-adapter';
import { randomUUID } from 'crypto';

const sessionAdapter = new InMemorySessionAdapter();
const storageAdapter = new InMemoryStorageAdapter();

export const POST: APIRoute = async ({ request, cookies }) => {
  const rpID = 'localhost'; // Must match the one used in register-request

  try {
    // For now, use empty allowCredentials to allow any registered authenticator
    const options = await generateAuthenticationOptions({
      rpID,
    });

    // Store challenge in session for verification
    const sessionId = cookies.get('session_id')?.value || randomUUID();
    await sessionAdapter.setSession(sessionId, options.challenge); // Store only challenge for login request
    cookies.set('session_id', sessionId, { httpOnly: true, secure: import.meta.env.PROD, path: '/' });

    return new Response(JSON.stringify(options), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Login request error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};