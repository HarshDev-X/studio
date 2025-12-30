import { initializeApp, getApp, getApps, App } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { headers } from 'next/headers';
import { getTokens } from 'next-firebase-auth-edge/lib/next/tokens';
import { mapKeys } from 'next-firebase-auth-edge/lib/auth/claims';
import { Tokens } from 'next-firebase-auth-edge/lib/auth';
import { filterStandardClaims } from 'next-firebase-auth-edge/lib/auth/claims';

export type FirebaseServices = {
  auth: Auth;
  firestore: Firestore;
};

export const getFirebaseAdminApp = (): FirebaseServices => {
  if (getApps().length) {
    const app = getApp();
    return {
      auth: getAuth(app),
      firestore: getFirestore(app)
    };
  }

  const app = initializeApp(firebaseConfig);

  return {
    auth: getAuth(app),
    firestore: getFirestore(app)
  };
};

export async function getAuthenticatedAppForUser() {
  const
    tokens = await getTokens(headers(), {
      apiKey: firebaseConfig.apiKey,
      cookieName: 'AuthToken',
      cookieSignatureKeys: ['secret1', 'secret2'],
      serviceAccount: {},
    });

  if (!tokens) {
    return { app: null, tokens: null };
  }

  const { auth } = getFirebaseAdminApp();

  const app = {
    auth,
    firestore: getFirestore(),
  }

  return { app, tokens };
}

function mapToUser(tokens: Tokens) {
  const {
    uid,
    email,
    picture: photoURL,
    email_verified: emailVerified,
    phone_number: phoneNumber,
    name: displayName,
  } = tokens;
  const customClaims = filterStandardClaims(tokens);

  return {
    uid,
    email,
    photoURL,
    emailVerified,
    phoneNumber,
    displayName,
    customClaims,
  };
}
