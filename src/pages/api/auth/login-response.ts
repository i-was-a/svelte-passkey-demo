import type { APIRoute } from 'astro';
import { verifyAuthentication } from '../../../lib/simplewebauthn-wrapper';
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

    const expectedChallenge = await sessionAdapter.getSession(sessionId);
    if (!expectedChallenge) {
      throw new Error('Challenge not found in session.');
    }

    // Get the authenticator from the response
    console.log('Looking for authenticator with ID:', body.id);
    const authenticator = await storageAdapter.getAuthenticator(body.id);
    if (!authenticator) {
      const allAuths = await storageAdapter.getAllAuthenticators();
      console.log('Available authenticators:', allAuths.map(a => ({ id: a.id, userId: a.userId })));
      throw new Error('Authenticator not found.');
    }
    
    console.log('Found authenticator:', {
      id: authenticator.id,
      userId: authenticator.userId,
      counter: authenticator.counter
    });

    const verification = await verifyAuthentication({
      response: body,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      credential: authenticator,
    });

    if (verification.verified && verification.authenticationInfo) {
      // Update the authenticator counter
      await storageAdapter.updateAuthenticatorCounter(
        verification.authenticationInfo.credentialID,
        verification.authenticationInfo.newCounter
      );
      
      // Get the authenticator to find the user
      const authenticator = await storageAdapter.getAuthenticator(verification.authenticationInfo.credentialID);
      
      if (authenticator) {
        const user = await storageAdapter.getUser(authenticator.userId);
        
        if (user) {
          // Update session with user ID after successful login
          await sessionAdapter.setSession(sessionId, user.id);

          return new Response(JSON.stringify({ verified: true, user: { id: user.id } }), {
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    }
    
    return new Response(JSON.stringify({ verified: false }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Login response error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};