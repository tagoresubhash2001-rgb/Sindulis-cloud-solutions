// Firebase connection for the Sindulis website (project: sindulis)
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase web config is safe to ship in client code; access is controlled
// by Firestore/Storage security rules, not by hiding these values.
const firebaseConfig = {
  apiKey: 'AIzaSyCsk5ekKvW8UD2tb2rxm7hm8dEqu-U7ixc',
  authDomain: 'sindulis.firebaseapp.com',
  projectId: 'sindulis',
  storageBucket: 'sindulis.firebasestorage.app',
  messagingSenderId: '313258065933',
  appId: '1:313258065933:web:cbe719773a9f1714421544',
  measurementId: 'G-5KD1D07FLK',
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Analytics only runs in supported browsers (not SSR / some privacy modes).
export let analytics: Analytics | null = null;
isSupported()
  .then((ok) => {
    if (ok) analytics = getAnalytics(app);
  })
  .catch(() => {
    analytics = null;
  });
