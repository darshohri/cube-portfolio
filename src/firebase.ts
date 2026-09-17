import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const requiredKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_PROJECT_ID'
];

// Determine if we have the minimum keys to attempt initialization
const hasFirebaseKeys = typeof import.meta.env !== 'undefined' && 
  requiredKeys.every(key => !!import.meta.env[key]);

let app: any = null;
let db: any = null;
let auth: any = null;

if (hasFirebaseKeys) {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
      appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string
    };

    const databaseId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID as string;

    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app, databaseId || undefined); /* CRITICAL: The app will break without this line */
    auth = getAuth(app);
  } catch (error) {
    console.error('CRITICAL: Firebase failed to initialize:', error);
  }
} else {
  console.warn(
    'WARNING: Firebase API key or Project ID is missing. The contact form will gracefully fallback to local offline storage.'
  );
}

export { db, auth, hasFirebaseKeys };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
