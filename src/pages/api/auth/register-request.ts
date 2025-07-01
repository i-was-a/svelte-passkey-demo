import type { APIRoute } from 'astro';
import { generateRegistrationOptions } from '../../../lib/simplewebauthn-wrapper';
import { InMemoryStorageAdapter } from '../../../lib/adapters/in-memory-storage-adapter';
import { InMemorySessionAdapter } from '../../../lib/adapters/in-memory-session-adapter';
import { randomUUID } from 'crypto';
import * as crypto from 'crypto';

const storageAdapter = new InMemoryStorageAdapter();
const sessionAdapter = new InMemorySessionAdapter();

export const POST: APIRoute = async ({ request, cookies }) => {
  const rpID = 'localhost'; // Replace with your domain in production
  const rpName = 'My Passkey Demo';

  try {
    // Create a new user first
    const user = await storageAdapter.createUser();
    const userId = new TextEncoder().encode(user.id);
    
    const result = await generateRegistrationOptions({
      rpID,
      rpName,
      userID: userId,
      userName: `user-${user.id}`,
      challenge: crypto.getRandomValues(new Uint8Array(32)),
    });

    // Store challenge and user ID in session for verification
    const sessionId = cookies.get('session_id')?.value || randomUUID();
    await sessionAdapter.setSession(sessionId, JSON.stringify({ challenge: result.challenge, userId: user.id }));
    cookies.set('session_id', sessionId, { httpOnly: true, secure: import.meta.env.PROD, path: '/' });

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Register request error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};