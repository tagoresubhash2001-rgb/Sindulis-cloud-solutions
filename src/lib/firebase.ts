// Firebase connection for the Sindulis website (project: sindulis)
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { initializeFirestore, getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase web config is safe to ship in client code; access is controlled
// by Firestore/Storage security rules, not by hiding these values.
export const firebaseConfig = {
  apiKey: 'AIzaSyCsk5ekKvW8UD2tb2rxm7hm8dEqu-U7ixc',
  authDomain: 'sindulis.firebaseapp.com',
  projectId: 'sindulis',
  storageBucket: 'sindulis.firebasestorage.app',
  messagingSenderId: '313258065933',
  appId: '1:313258065933:web:cbe719773a9f1714421544',
  measurementId: 'G-5KD1D07FLK',
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
// ignoreUndefinedProperties: optional fields left undefined are dropped instead of throwing.
let firestore: Firestore;
try {
  firestore = initializeFirestore(app, { ignoreUndefinedProperties: true });
} catch {
  firestore = getFirestore(app); // already initialised (HMR)
}
export const db = firestore;
export const auth = getAuth(app);
export const storage = getStorage(app);

// Local development / automated tests: `VITE_USE_EMULATORS=true npm run dev`
// points every SDK at the Firebase Emulator Suite instead of production.
export const usingEmulators = import.meta.env.VITE_USE_EMULATORS === 'true';
if (usingEmulators) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
}

// Analytics only runs in supported browsers (not SSR / some privacy modes).
export let analytics: Analytics | null = null;
isSupported()
  .then((ok) => {
    if (ok && !usingEmulators) analytics = getAnalytics(app);
  })
  .catch(() => {
    analytics = null;
  });
