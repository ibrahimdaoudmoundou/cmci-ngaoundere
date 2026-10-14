export const hasCoords = (p: { lat?: number | ""; lng?: number | "" }) =>
  p.lat !== "" && p.lng !== "" && p.lat != null && p.lng != null && Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lng));
