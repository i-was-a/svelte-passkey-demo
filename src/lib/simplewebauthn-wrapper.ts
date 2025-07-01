// Dynamic import to avoid SSR module resolution issues
let server: any = null;

async function getServer() {
  if (!server) {
    server = await import('@simplewebauthn/server');
  }
  return server;
}

export async function generateAuthenticationOptions(options: any) {
  const s = await getServer();
  return s.generateAuthenticationOptions(options);
}

export async function generateRegistrationOptions(options: any) {
  const s = await getServer();
  return s.generateRegistrationOptions(options);
}

export async function verifyAuthenticationResponse(options: any) {
  const s = await getServer();
  return s.verifyAuthenticationResponse(options);
}

export async function verifyRegistrationResponse(options: any) {
  const s = await getServer();
  return s.verifyRegistrationResponse(options);
}

// Legacy aliases for compatibility with existing code
export const verifyAuthentication = verifyAuthenticationResponse;
export const verifyRegistration = verifyRegistrationResponse;
