"use client";
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** Vrai quand les variables Firebase sont renseignées (.env.local ou Vercel). */
export const firebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId);
export const storageEnabled =
  process.env.NEXT_PUBLIC_STORAGE_ENABLED === "true" && Boolean(config.storageBucket);

let app: FirebaseApp | null = null;

function getApp(): FirebaseApp {
  if (!firebaseConfigured) throw new Error("Firebase n'est pas configuré : renseignez les variables NEXT_PUBLIC_FIREBASE_*.");
  if (!app) app = getApps()[0] ?? initializeApp(config);
  return app;
}

// Initialisation paresseuse : uniquement dans le navigateur, jamais au rendu serveur.
export const fbAuth = (): Auth => getAuth(getApp());
export const fbDb = (): Firestore => getFirestore(getApp());
export const fbStorage = (): FirebaseStorage => getStorage(getApp());
