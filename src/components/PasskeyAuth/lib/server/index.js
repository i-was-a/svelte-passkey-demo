import { generateRegistrationOptions as swoGenerateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions as swoGenerateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server';
export async function generateRegistrationOptions(args) {
    const { rpID, rpName, storageAdapter } = args;
    // Create a new user in the database
    const user = await storageAdapter.createUser();
    const options = await swoGenerateRegistrationOptions({
        rpID,
        rpName,
        userID: new TextEncoder().encode(user.id),
        userName: `user-${user.id}`,
        attestationType: 'none',
        excludeCredentials: [], // No credentials to exclude for a new user
        authenticatorSelection: {
            residentKey: 'required',
            userVerification: 'preferred',
        },
    });
    // Temporarily store the challenge for the user
    // In a real app, you'd likely use a short-lived session or cache for this
    // For simplicity, we'll assume a session mechanism handles this association.
    return { options, user };
}
export async function verifyRegistration(args) {
    const { response, expectedChallenge, expectedOrigin, rpID, storageAdapter, user } = args;
    const verification = await verifyRegistrationResponse({
        response,
        expectedChallenge,
        expectedOrigin,
        expectedRPID: rpID,
        requireUserVerification: true,
    });
    if (verification.verified && verification.registrationInfo) {
        const { credential } = verification.registrationInfo;
        const newAuthenticator = {
            credentialID: Buffer.from(credential.id).toString('base64url'),
            credentialPublicKey: Buffer.from(credential.publicKey),
            counter: 0,
            credentialDeviceType: 'singleDevice',
            credentialBackedUp: false,
            transports: response.response.transports || [],
            userId: user.id,
        };
        await storageAdapter.saveAuthenticator(newAuthenticator);
        return { verified: true, user };
    }
    return { verified: false };
}
export async function generateAuthenticationOptions(args) {
    const { rpID } = args;
    const options = await swoGenerateAuthenticationOptions({
        rpID,
        userVerification: 'preferred',
        allowCredentials: [], // Allow any discoverable credential
    });
    return options;
}
export async function verifyAuthentication(args) {
    const { response, expectedChallenge, expectedOrigin, rpID, storageAdapter } = args;
    const authenticator = await storageAdapter.getAuthenticator(Buffer.from(response.rawId, 'base64url').toString('base64url'));
    if (!authenticator) {
        throw new Error(`Authenticator with ID ${response.id} not found.`);
    }
    const verification = await verifyAuthenticationResponse({
        response,
        expectedChallenge,
        expectedOrigin,
        expectedRPID: rpID,
        credential: {
            id: authenticator.credentialID,
            publicKey: Buffer.from(authenticator.credentialPublicKey),
            counter: authenticator.counter,
            transports: authenticator.transports,
        },
        requireUserVerification: true,
    });
    if (verification.verified) {
        const { newCounter } = verification.authenticationInfo;
        await storageAdapter.updateAuthenticatorCounter(authenticator.credentialID, newCounter);
        const user = await storageAdapter.getUser(authenticator.userId);
        return { verified: true, user };
    }
    return { verified: false };
}
export async function handleLogout(args) {
    await args.sessionAdapter.deleteSession(args.sessionId);
}
export async function getSession(args) {
    const userHandle = await args.sessionAdapter.getSession(args.sessionId);
    if (userHandle) {
        const user = await args.storageAdapter.getUser(userHandle);
        return { isLoggedIn: true, user };
    }
    return { isLoggedIn: false, user: null };
}
