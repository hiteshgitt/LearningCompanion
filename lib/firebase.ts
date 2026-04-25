import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
let auth: any = null;

export const initAuth = async () => {
  try {
    if (!auth) {
      const { getAuth, signInAnonymously } = await import('firebase/auth');
      auth = getAuth(app);
    }
    if (!auth.currentUser) {
      const { signInAnonymously } = await import('firebase/auth');
      await signInAnonymously(auth);
    }
  } catch (error) {
    console.error('Firebase Auth Error:', error);
  }
};

export { db, auth };
