import type { APIRoute } from 'astro';
import { verifyRegistration } from '../../../lib/simplewebauthn-wrapper';
import { InMemoryStorageAdapter } from '../../../lib/adapters/in-memory-storage-adapter';
import { InMemorySessionAdapter } from '../../../lib/adapters/in-memory-session-adapter';

const storageAdapter = new InMemoryStorageAdapter();
const sessionAdapter = new InMemorySessionAdapter();

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json();
  const rpID = 'localhost'; // Must match the one used in register-request
  const expectedOrigin = import.meta.env.PROD ? 'YOUR_PRODUCTION_ORIGIN' : 'http://localhost:4321'; // Astro dev server origin

  try {
    const sessionId = cookies.get('session_id')?.value;
    if (!sessionId) {
      throw new Error('Session ID not found.');
    }

    const sessionData = await sessionAdapter.getSession(sessionId);
    if (!sessionData) {
      throw new Error('Session data not found.');
    }
    const { challenge, userId } = JSON.parse(sessionData);

    // Get user from storage
    const user = await storageAdapter.getUser(userId);
    if (!user) {
      throw new Error('User not found for verification.');
    }

    const verification = await verifyRegistration({
      response: body,
      expectedChallenge: challenge,
      expectedOrigin,
      expectedRPID: rpID,
    });

    if (verification.verified && verification.registrationInfo) {
      // Convert credential to authenticator format and store it
      const authenticator = {
        id: verification.registrationInfo.credential.id,
        publicKey: verification.registrationInfo.credential.publicKey,
        counter: verification.registrationInfo.credential.counter,
        userId: userId,
        transports: verification.registrationInfo.credential.transports || [],
      };
      
      console.log('Saving authenticator:', {
        id: authenticator.id,
        userId: authenticator.userId,
        counter: authenticator.counter
      });
      
      await storageAdapter.saveAuthenticator(authenticator);
      
      // Clear challenge from session after successful verification
      await sessionAdapter.setSession(sessionId, user.id); // Store only user ID for login session

      return new Response(JSON.stringify({ verified: true, user: { id: user.id } }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ verified: false }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Register response error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};