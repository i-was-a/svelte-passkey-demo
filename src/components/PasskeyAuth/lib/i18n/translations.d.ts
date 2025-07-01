export interface Translations {
    auth: {
        title?: string;
        signIn: string;
        createAccount: string;
        processing: string;
        error: string;
    };
    dashboard: {
        title?: string;
        welcome: string;
        loggedIn: string;
        userHandle: string;
        logout: string;
    };
}
export declare const translations: Record<string, Translations>;
export declare function getTranslations(locale?: string): Translations;
