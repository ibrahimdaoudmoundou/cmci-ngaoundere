"use client";
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

/**
 * Configuration Web du projet Firebase « cmci-ngaoundere ».
 * Ces valeurs ne sont pas secrètes : elles sont envoyées à chaque navigateur ;
 * la sécurité des données repose sur les règles Firestore (firestore.rules).
 * Les variables NEXT_PUBLIC_FIREBASE_* (fichier .env.local ou Vercel) les remplacent si elles sont définies.
 */
const DEFAUT = {
  apiKey: "AIzaSyBN4zwtn7_BWkZmbJPto_Maic6DDsbWYgw",
  authDomain: "cmci-ngaoundere.firebaseapp.com",
  projectId: "cmci-ngaoundere",
  storageBucket: "cmci-ngaoundere.firebasestorage.app",
  messagingSenderId: "932647458360",
  appId: "1:932647458360:web:eb80842c72cdf391c278cd",
};

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || DEFAUT.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || DEFAUT.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || DEFAUT.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || DEFAUT.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || DEFAUT.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || DEFAUT.appId,
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
