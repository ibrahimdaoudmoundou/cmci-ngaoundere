export function downloadCsv(filename: string, headers: string[], rows: unknown[][]) {
  const cell = (v: unknown) => {
    const s = String(v ?? "");
    return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  // Point-virgule + BOM : s'ouvre correctement dans Excel en français.
  const csv = "﻿" + [headers.map(cell).join(";"), ...rows.map((r) => r.map(cell).join(";"))].join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
