import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import type { Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
let auth: Auth | null = null;
let analytics: Analytics | null = null;

export const initAuth = async () => {
  try {
    if (!auth) {
      const { getAuth } = await import('firebase/auth');
      auth = getAuth(app);
    }
    if (!auth.currentUser) {
      const { signInAnonymously } = await import('firebase/auth');
      await signInAnonymously(auth);
    }
  } catch (error: unknown) {
    console.error('Firebase Auth Error:', error instanceof Error ? error.message : 'Unknown error');
  }
};

// Initialize Analytics lazily on the client
if (typeof window !== 'undefined') {
  import('firebase/analytics').then(({ getAnalytics, isSupported }) => {
    isSupported().then(supported => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    });
  }).catch(err => console.error('Analytics failed to load', err));
}

export { db, auth, analytics };
