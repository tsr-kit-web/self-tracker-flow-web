export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: _NGX_ENV_.NG_APP_FIREBASE_API_KEY,
    authDomain: _NGX_ENV_.NG_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: _NGX_ENV_.NG_APP_DATABASE_URL,
    projectId: _NGX_ENV_.NG_APP_FIREBASE_PROJECT_ID,
    storageBucket: _NGX_ENV_.NG_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: _NGX_ENV_.NG_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: _NGX_ENV_.NG_APP_FIREBASE_APP_ID,
  },
};
