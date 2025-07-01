export declare function register(requestUrl: string, responseUrl: string): Promise<void>;
export declare function login(requestUrl: string, responseUrl: string): Promise<void>;
export declare function logout(url: string): Promise<void>;
export declare function checkSession(url: string): Promise<void>;
