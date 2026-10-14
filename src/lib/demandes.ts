"use client";
import { addDoc, collection } from "firebase/firestore";
import { fbDb } from "./firebase";
import { nowIso } from "./format";
import type { Demande } from "./types";

export type NewDemande = Omit<Demande, "uid" | "statut" | "cree">;

export async function envoyerDemande(uid: string, d: NewDemande) {
  const clean = Object.fromEntries(Object.entries(d).filter(([, v]) => v !== undefined));
  await addDoc(collection(fbDb(), "demandes"), { ...clean, uid, statut: "en_attente", cree: nowIso() });
}

export function resume(d: Partial<Demande>) {
  if (d.type === "rdv") return `${d.avecNom} · ${d.date} · ${d.creneau}`;
  if (d.type === "commande") return `${d.titre} × ${d.qte}`;
  if (d.type === "inscription") return `${d.nom}${d.centre ? " · " + d.centre : ""}`;
  return "";
}
