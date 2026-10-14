"use client";
import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import { CITY } from "@/lib/format";
import { hasCoords } from "@/lib/geo";

export interface MapPoint { id: string; nom: string; lat?: number | ""; lng?: number | ""; kind?: "centre" | "localite" | "eglise" }

function FitBounds({ pts }: { pts: [number, number][] }) {
  const map = useMap();
  const key = JSON.stringify(pts);
  useEffect(() => {
    if (pts.length > 1) map.fitBounds(L.latLngBounds(pts), { padding: [40, 40], maxZoom: 15 });
    else if (pts.length === 1) map.setView(pts[0], 14);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return null;
}
function FlyTo({ pt }: { pt: [number, number] | null }) {
  const map = useMap();
  useEffect(() => { if (pt) map.flyTo(pt, Math.max(map.getZoom(), 14), { duration: 0.6 }); }, [pt, map]);
  return null;
}
const icon = (kind: string, sel: boolean) => {
  const s = sel ? 28 : 22;
  return L.divIcon({ className: "", html: `<div class="cmci-pin ${kind === "localite" ? "loc" : ""} ${sel ? "sel" : ""}"></div>`, iconSize: [s, s], iconAnchor: [s / 2, s / 2] });
};


export default function MapPoints({ points, selected, onSelect, height = "h-[420px] sm:h-[520px]" }: { points: MapPoint[]; selected: string | null; onSelect: (id: string) => void; height?: string }) {
  const placed = points.filter(hasCoords);
  const pts = placed.map((c) => [Number(c.lat), Number(c.lng)] as [number, number]);
  const sel = placed.find((c) => c.id === selected);
  return (
    <MapContainer center={[CITY.lat, CITY.lng]} zoom={12} scrollWheelZoom={false} className={`w-full ${height}`}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitBounds pts={pts} />
      <FlyTo pt={sel ? [Number(sel.lat), Number(sel.lng)] : null} />
      {placed.map((c) => (
        <Marker key={c.id} position={[Number(c.lat), Number(c.lng)]} icon={icon(c.kind || "centre", c.id === selected)} eventHandlers={{ click: () => onSelect(c.id) }}>
          <Tooltip direction="right" offset={[12, 0]} permanent className="cmci-label">{c.nom}</Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
