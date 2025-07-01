import type { StorageAdapter, SessionAdapter, User } from './adapters/types';
interface GenerateRegistrationOptionsArgs {
    rpID: string;
    rpName: string;
    storageAdapter: StorageAdapter;
}
export declare function generateRegistrationOptions(args: GenerateRegistrationOptionsArgs): Promise<{
    options: import("@simplewebauthn/server").PublicKeyCredentialCreationOptionsJSON;
    user: User;
}>;
interface VerifyRegistrationArgs {
    response: any;
    expectedChallenge: string;
    expectedOrigin: string;
    rpID: string;
    storageAdapter: StorageAdapter;
    user: User;
}
export declare function verifyRegistration(args: VerifyRegistrationArgs): Promise<{
    verified: boolean;
    user: User;
} | {
    verified: boolean;
    user?: undefined;
}>;
interface GenerateAuthenticationOptionsArgs {
    rpID: string;
}
export declare function generateAuthenticationOptions(args: GenerateAuthenticationOptionsArgs): Promise<import("@simplewebauthn/server").PublicKeyCredentialRequestOptionsJSON>;
interface VerifyAuthenticationArgs {
    response: any;
    expectedChallenge: string;
    expectedOrigin: string;
    rpID: string;
    storageAdapter: StorageAdapter;
}
export declare function verifyAuthentication(args: VerifyAuthenticationArgs): Promise<{
    verified: boolean;
    user: User | null;
} | {
    verified: boolean;
    user?: undefined;
}>;
interface HandleLogoutArgs {
    sessionId: string;
    sessionAdapter: SessionAdapter;
}
export declare function handleLogout(args: HandleLogoutArgs): Promise<void>;
interface GetSessionArgs {
    sessionId: string;
    sessionAdapter: SessionAdapter;
    storageAdapter: StorageAdapter;
}
export declare function getSession(args: GetSessionArgs): Promise<{
    isLoggedIn: boolean;
    user: User | null;
}>;
export {};
