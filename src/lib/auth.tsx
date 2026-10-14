"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, signOut, updateProfile, sendPasswordResetEmail, type User,
} from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { fbAuth, fbDb, firebaseConfigured } from "./firebase";
import { nowIso } from "./format";
import type { Profil } from "./types";

interface AuthState {
  user: User | null; profil: Profil | null; isAdmin: boolean; loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (p: { nom: string; tel: string; email: string; pass: string; quartier?: string; centre?: string }) => Promise<void>;
  google: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  saveProfil: (p: Profil) => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profil, setProfil] = useState<Profil | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) { setLoading(false); return; }
    let unsubs: (() => void)[] = [];
    const off = onAuthStateChanged(fbAuth(), (u) => {
      unsubs.forEach((f) => f()); unsubs = [];
      setUser(u);
      if (!u) { setProfil(null); setIsAdmin(false); setLoading(false); return; }
      unsubs.push(onSnapshot(doc(fbDb(), "profils", u.uid), (s) => setProfil(s.exists() ? (s.data() as Profil) : null), () => setProfil(null)));
      unsubs.push(onSnapshot(doc(fbDb(), "roles", u.uid),
        (s) => { setIsAdmin(s.exists() && s.data()?.role === "admin"); setLoading(false); },
        () => { setIsAdmin(false); setLoading(false); }));
    });
    return () => { off(); unsubs.forEach((f) => f()); };
  }, []);

  const value: AuthState = {
    user, profil, isAdmin, loading,
    login: async (email, pass) => { await signInWithEmailAndPassword(fbAuth(), email.trim(), pass); },
    register: async ({ nom, tel, email, pass, quartier, centre }) => {
      const cred = await createUserWithEmailAndPassword(fbAuth(), email.trim(), pass);
      await updateProfile(cred.user, { displayName: nom });
      await setDoc(doc(fbDb(), "profils", cred.user.uid), { nom, tel, email: email.trim(), quartier: quartier || "", centre: centre || "", cree: nowIso() });
    },
    google: async () => {
      const cred = await signInWithPopup(fbAuth(), new GoogleAuthProvider());
      const ref = doc(fbDb(), "profils", cred.user.uid);
      const s = await getDoc(ref);
      if (!s.exists()) await setDoc(ref, { nom: cred.user.displayName || "", tel: "", email: cred.user.email || "", quartier: "", centre: "", cree: nowIso() });
    },
    logout: async () => { await signOut(fbAuth()); },
    resetPassword: async (email) => { await sendPasswordResetEmail(fbAuth(), email.trim()); },
    saveProfil: async (p) => {
      if (!user) return;
      await setDoc(doc(fbDb(), "profils", user.uid), { nom: p.nom || "", tel: p.tel || "", quartier: p.quartier || "", centre: p.centre || "", email: user.email || "", maj: nowIso() }, { merge: true });
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth doit être utilisé dans <AuthProvider>");
  return c;
}

export function authMessage(code?: string, en = false) {
  const L = (f: string, e: string) => (en ? e : f);
  switch (code) {
    case "auth/invalid-credential": case "auth/wrong-password": case "auth/user-not-found": return L("E-mail ou mot de passe incorrect.", "Incorrect e-mail or password.");
    case "auth/email-already-in-use": return L("Un compte existe déjà avec cet e-mail. Connectez-vous.", "An account already exists with this e-mail. Please sign in.");
    case "auth/weak-password": return L("Le mot de passe doit contenir au moins 6 caractères.", "The password must be at least 6 characters.");
    case "auth/invalid-email": return L("Adresse e-mail invalide.", "Invalid e-mail address.");
    case "auth/too-many-requests": return L("Trop de tentatives. Patientez quelques minutes.", "Too many attempts. Please wait a few minutes.");
    case "auth/popup-closed-by-user": return L("Connexion Google annulée.", "Google sign-in cancelled.");
    case "auth/network-request-failed": return L("Pas de connexion Internet. Réessayez.", "No internet connection. Please try again.");
    default: return L("Une erreur est survenue. Réessayez.", "Something went wrong. Please try again.");
  }
}
