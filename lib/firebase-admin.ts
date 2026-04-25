import admin from 'firebase-admin';

/**
 * @function getFirestoreAdmin
 * @description Initializes and returns the Firestore Admin SDK using Application Default Credentials (ADC).
 * This is the enterprise-standard way to connect on Google Cloud Run.
 */
export function getFirestoreAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
  return admin.firestore();
}

/**
 * @function getStorageAdmin
 * @description Returns the Firebase Storage bucket using the Admin SDK.
 */
export function getStorageAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
  return admin.storage().bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
}
