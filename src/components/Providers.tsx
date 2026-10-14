"use client";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AuthProvider } from "@/lib/auth";
import { firebaseConfigured } from "@/lib/firebase";
import { LangProvider } from "@/lib/i18n";

const ToastCtx = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export default function Providers({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useCallback((m: string) => {
    setMsg(m);
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => setMsg(null), 3200);
  }, []);
  return (
    <LangProvider>
    <AuthProvider>
      <ToastCtx.Provider value={toast}>
        {!firebaseConfigured && (
          <div className="bg-warn-soft px-4 py-2 text-center text-sm text-ink">
            Configuration Firebase manquante : copiez <code>.env.example</code> en <code>.env.local</code> et renseignez vos clés (voir README).
          </div>
        )}
        {children}
        {msg && (
          <div role="status" className="fixed bottom-5 left-1/2 z-[60] max-w-[calc(100%-32px)] -translate-x-1/2 rounded-lg bg-ink px-4 py-2.5 text-sm text-bg shadow-lg">
            {msg}
          </div>
        )}
      </ToastCtx.Provider>
    </AuthProvider>
    </LangProvider>
  );
}
