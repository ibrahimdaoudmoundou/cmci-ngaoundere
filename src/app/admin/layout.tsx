import type { ReactNode } from "react";
import { AdminGate } from "@/components/AdminShell";

export const metadata = { title: "Gestion", robots: { index: false } };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminGate>{children}</AdminGate>;
}
