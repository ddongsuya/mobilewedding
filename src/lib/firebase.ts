/**
 * Firebase Configuration and Initialization
 * 
 * This module initializes Firebase and exports Firestore instance for use in services.
 * 
 * Requirements:
 * - 10.1: 방명록 메시지를 영구 저장소에 저장한다
 * - 10.2: RSVP 응답을 영구 저장소에 저장한다
 * 
 * Firestore Structure:
 * /weddings/{weddingId}/
 *   - config: WeddingConfig
 *   - guestbook/
 *     - {messageId}: GuestbookMessage
 *   - rsvp/
 *     - {responseId}: RsvpResponse
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Firebase configuration interface
 * These values should be provided via environment variables
 */
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

/**
 * Get Firebase configuration from environment variables
 * 
 * Environment variables should be prefixed with VITE_ for Vite to expose them
 * to the client-side code.
 * 
 * Required environment variables:
 * - VITE_FIREBASE_API_KEY
 * - VITE_FIREBASE_AUTH_DOMAIN
 * - VITE_FIREBASE_PROJECT_ID
 * - VITE_FIREBASE_STORAGE_BUCKET
 * - VITE_FIREBASE_MESSAGING_SENDER_ID
 * - VITE_FIREBASE_APP_ID
 */
function getFirebaseConfig(): FirebaseConfig {
  const config: FirebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  };

  return config;
}

/**
 * Check if Firebase is properly configured
 * Returns true if all required environment variables are set
 */
export function isFirebaseConfigured(): boolean {
  const config = getFirebaseConfig();
  return !!(
    config.apiKey &&
    config.authDomain &&
    config.projectId &&
    config.storageBucket &&
    config.messagingSenderId &&
    config.appId
  );
}

// Firebase app instance
let app: FirebaseApp | null = null;

// Firestore instance
let db: Firestore | null = null;

/**
 * Initialize Firebase app
 * Only initializes if not already initialized and configuration is available
 */
function initializeFirebase(): FirebaseApp | null {
  if (app) {
    return app;
  }

  const config = getFirebaseConfig();
  
  // Check if configuration is available
  if (!isFirebaseConfigured()) {
    console.warn(
      'Firebase is not configured. Please set the following environment variables:\n' +
      '- VITE_FIREBASE_API_KEY\n' +
      '- VITE_FIREBASE_AUTH_DOMAIN\n' +
      '- VITE_FIREBASE_PROJECT_ID\n' +
      '- VITE_FIREBASE_STORAGE_BUCKET\n' +
      '- VITE_FIREBASE_MESSAGING_SENDER_ID\n' +
      '- VITE_FIREBASE_APP_ID'
    );
    return null;
  }

  try {
    app = initializeApp(config);
    return app;
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return null;
  }
}

/**
 * Get Firestore instance
 * Initializes Firebase if not already initialized
 * 
 * @returns Firestore instance or null if Firebase is not configured
 */
export function getFirestoreInstance(): Firestore | null {
  if (db) {
    return db;
  }

  const firebaseApp = initializeFirebase();
  if (!firebaseApp) {
    return null;
  }

  try {
    db = getFirestore(firebaseApp);
    return db;
  } catch (error) {
    console.error('Failed to initialize Firestore:', error);
    return null;
  }
}

/**
 * Get Firebase app instance
 * 
 * @returns Firebase app instance or null if not initialized
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!app) {
    initializeFirebase();
  }
  return app;
}

// Collection names for Firestore
export const COLLECTIONS = {
  WEDDINGS: 'weddings',
  GUESTBOOK: 'guestbook',
  RSVP: 'rsvp',
} as const;

// Default wedding ID (can be overridden via environment variable)
export function getWeddingId(): string {
  return import.meta.env.VITE_WEDDING_ID || 'default';
}

// Export Firestore instance for convenience
// Note: This may be null if Firebase is not configured
export const firestore = getFirestoreInstance();
