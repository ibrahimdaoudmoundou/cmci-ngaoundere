"use client";
import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, query, where, type QueryConstraint } from "firebase/firestore";
import { fbDb, firebaseConfigured } from "./firebase";
import type { WithId } from "./types";

export interface Live<T> { data: T; loading: boolean; error: string | null }

/** Abonnement en direct à une collection Firestore. `key` doit changer quand le filtre change. */
export function useCollection<T>(path: string | null, filter?: [string, "==", unknown]): Live<WithId<T>[]> {
  const [state, setState] = useState<Live<WithId<T>[]>>({ data: [], loading: true, error: null });
  const fKey = filter ? JSON.stringify(filter) : "";
  useEffect(() => {
    if (!path || !firebaseConfigured) { setState({ data: [], loading: false, error: null }); return; }
    const cons: QueryConstraint[] = filter ? [where(filter[0], filter[1], filter[2])] : [];
    const q = query(collection(fbDb(), path), ...cons);
    return onSnapshot(
      q,
      (snap) => setState({ data: snap.docs.map((d) => ({ ...(d.data() as T), id: d.id })), loading: false, error: null }),
      (err) => { console.warn(path, err); setState({ data: [], loading: false, error: err.code }); },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, fKey]);
  return state;
}

export function useDocument<T>(path: string | null): Live<T | null> {
  const [state, setState] = useState<Live<T | null>>({ data: null, loading: true, error: null });
  useEffect(() => {
    if (!path || !firebaseConfigured) { setState({ data: null, loading: false, error: null }); return; }
    return onSnapshot(
      doc(fbDb(), path),
      (s) => setState({ data: s.exists() ? (s.data() as T) : null, loading: false, error: null }),
      (err) => { console.warn(path, err); setState({ data: null, loading: false, error: err.code }); },
    );
  }, [path]);
  return state;
}
