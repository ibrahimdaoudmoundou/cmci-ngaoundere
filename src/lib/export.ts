import { downloadCsv } from "./csv";
import { ENTITIES } from "./entities";
import { today } from "./format";

export function exportEntity(key: string, rows: object[]) {
  const fields = ENTITIES[key].fields.filter((f) => f.t !== "image");
  downloadCsv(`cmci-${key}-${today()}.csv`, fields.map((f) => f.l),
    (rows as Record<string, unknown>[]).map((r) => fields.map((f) => (f.k === "type" ? (r.type === "sortie" ? "Sortie" : "Entrée") : r[f.k]))));
}
