"use client";
import { useState } from "react";
import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { fbDb, fbStorage, storageEnabled } from "@/lib/firebase";
import { ENTITIES, DEFAULTS, type Field, type Opt } from "@/lib/entities";
import { FIN_IN, FIN_OUT, nowIso, today } from "@/lib/format";
import { Modal } from "./ui";
import { useToast } from "./Providers";

type Rec = Record<string, unknown> & { id?: string };

export default function EntityEditor({ entity, item, centres, onClose }: { entity: string; item?: Rec | null; centres: string[]; onClose: () => void }) {
  const E = ENTITIES[entity];
  const toast = useToast();
  const init: Rec = item ? { ...item } : { ...DEFAULTS[entity] };
  if (!item && entity === "finances") init.date = today();
  if (!item && entity === "membres") init.dateAdhesion = today();
  if (!item && entity === "articles") init.date = today();
  const [v, setV] = useState<Rec>(init);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [armed, setArmed] = useState(false);
  const set = (k: string, val: unknown) => setV((o) => ({ ...o, [k]: val }));

  const options = (f: Field): Opt[] => {
    let o = typeof f.o === "function" ? f.o(centres) : f.o || [];
    if (entity === "finances" && f.k === "categorie") o = v.type === "sortie" ? FIN_OUT : FIN_IN;
    const cur = String(v[f.k] ?? "");
    const has = o.some((x) => (typeof x === "string" ? x : x.v) === cur);
    return cur && !has ? [cur, ...o] : o;
  };

  async function upload(f: Field, file: File) {
    if (file.size > 5 * 1024 * 1024) { setErr("Image trop lourde (5 Mo maximum)."); return; }
    setErr("Envoi de l'image…");
    try {
      const r = ref(fbStorage(), `public/${entity}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`);
      await uploadBytes(r, file, { contentType: file.type });
      set(f.k, await getDownloadURL(r));
      setErr("");
    } catch (e) { console.warn(e); setErr("L'image n'a pas pu être envoyée. Vérifiez que Firebase Storage est activé, ou collez un lien d'image."); }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    const out: Record<string, unknown> = {};
    for (const f of E.fields) {
      let val = v[f.k];
      if (f.t === "number") val = val === "" || val === undefined || val === null ? "" : Number(val);
      else if (f.t === "bool") val = val === true || val === "true";
      else val = String(val ?? "").trim();
      if (f.req && (val === "" || (f.t === "number" && Number.isNaN(val)))) { setErr(`Le champ « ${f.l} » est obligatoire.`); return; }
      out[f.k] = val;
    }
    if (entity === "finances" && !(Number(out.montant) > 0)) { setErr("Le montant doit être supérieur à zéro."); return; }
    if (entity === "livres" && Number(out.prix) < 0) { setErr("Le prix ne peut pas être négatif."); return; }
    out.exemple = false; out.maj = nowIso();
    setBusy(true);
    try {
      if (item?.id) {
        const { id: _id, ...rest } = item; void _id;
        await setDoc(doc(fbDb(), E.path, item.id), { ...rest, ...out });
      } else {
        const ref = await addDoc(collection(fbDb(), E.path), { ...out, cree: nowIso() });
        void ref;
      }
      toast(item?.id ? "Modifications enregistrées" : "Ajouté");
      onClose();
    } catch (e) {
      console.warn(e); setBusy(false);
      setErr("Enregistrement impossible. Vérifiez votre connexion et vos droits d'administrateur.");
    }
  }

  async function remove() {
    if (!armed) { setArmed(true); return; }
    setBusy(true);
    try { await deleteDoc(doc(fbDb(), E.path, item!.id!)); toast("Supprimé"); onClose(); }
    catch { setBusy(false); setErr("Suppression impossible."); }
  }

  return (
    <Modal title={`${item?.id ? "Modifier" : "Ajouter"} ${E.label}`} onClose={onClose}>
      <form onSubmit={save} className="grid gap-3.5 sm:grid-cols-2" noValidate>
        {(entity === "articles" || entity === "departements" || entity === "localites") && (
          <p className="text-sm text-muted sm:col-span-2">Les champs « en anglais » sont facultatifs : s'ils sont vides, la version française s'affiche aussi en anglais.</p>
        )}
        {E.fields.map((f) => {
          const id = `ed-${f.k}`;
          const wrap = `field ${f.full ? "sm:col-span-2" : ""}`;
          const label = <>{f.l}{f.hint && <span className="hint"> — {f.hint}</span>}</>;
          if (f.t === "select")
            return <label key={f.k} className={wrap}>{label}
              <select id={id} className="input" value={String(v[f.k] ?? "")} onChange={(e) => set(f.k, e.target.value)}>
                {options(f).map((o) => { const val = typeof o === "string" ? o : o.v; const l = typeof o === "string" ? o || "—" : o.l; return <option key={val} value={val}>{l}</option>; })}
              </select></label>;
          if (f.t === "bool")
            return <label key={f.k} className={wrap}>{label}
              <select id={id} className="input" value={v[f.k] === false || v[f.k] === "false" ? "false" : "true"} onChange={(e) => set(f.k, e.target.value === "true")}>
                <option value="true">{f.boolLabels?.[0]}</option><option value="false">{f.boolLabels?.[1]}</option>
              </select></label>;
          if (f.t === "textarea" || f.t === "long")
            return <label key={f.k} className={wrap}>{label}<textarea id={id} className={`input ${f.t === "long" ? "min-h-[200px] font-mono text-[0.85rem]" : "min-h-[90px]"}`} value={String(v[f.k] ?? "")} onChange={(e) => set(f.k, e.target.value)} /></label>;
          if (f.t === "image")
            return <div key={f.k} className={wrap}>
              <span>{f.l}</span>
              <div className="flex flex-wrap items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {v[f.k] ? <img src={String(v[f.k])} alt="" className="h-16 w-16 rounded-lg border border-line object-cover" /> : null}
                <input className="input flex-1" placeholder="Lien de l'image (https://…)" value={String(v[f.k] ?? "")} onChange={(e) => set(f.k, e.target.value)} />
                {storageEnabled && <input type="file" accept="image/*" className="text-sm" onChange={(e) => e.target.files?.[0] && upload(f, e.target.files[0])} />}
              </div>
            </div>;
          return <label key={f.k} className={wrap}>{label}
            <input id={id} className="input" type={f.t || "text"} step={f.step} value={String(v[f.k] ?? "")} onChange={(e) => set(f.k, e.target.value)} /></label>;
        })}
        <div className="flex flex-wrap items-center gap-2.5 sm:col-span-2">
          <button className="btn" disabled={busy}>Enregistrer</button>
          <button type="button" className="btn-ghost" onClick={onClose}>Annuler</button>
          {item?.id && <button type="button" onClick={remove} disabled={busy} className={armed ? "btn-danger btn-sm ml-auto" : "btn-ghost btn-sm ml-auto"}>{armed ? "Confirmer la suppression" : "Supprimer…"}</button>}
          {err && <span role="alert" className="w-full text-sm text-bad">{err}</span>}
        </div>
      </form>
    </Modal>
  );
}
