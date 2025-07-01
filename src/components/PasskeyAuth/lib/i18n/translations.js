export const translations = {
    en: {
        auth: {
            title: 'Passkey Authentication',
            signIn: 'Sign In with Passkey',
            createAccount: 'Create New Account with Passkey',
            processing: 'Processing...',
            error: 'Error:'
        },
        dashboard: {
            title: 'Welcome!',
            welcome: 'Welcome!',
            loggedIn: 'You are logged in.',
            userHandle: 'Your User Handle:',
            logout: 'Logout'
        }
    },
    ja: {
        auth: {
            title: 'パスキー認証',
            signIn: 'パスキーでサインイン',
            createAccount: 'パスキーで新規アカウント作成',
            processing: '処理中...',
            error: 'エラー:'
        },
        dashboard: {
            title: 'ようこそ！',
            welcome: 'ようこそ！',
            loggedIn: 'ログインしています。',
            userHandle: 'ユーザーハンドル:',
            logout: 'ログアウト'
        }
    }
};
export function getTranslations(locale = 'en') {
    return translations[locale] || translations.en;
}
