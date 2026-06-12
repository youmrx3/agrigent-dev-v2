"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LatLng } from "@/stores/dashboard-store";

// @ts-expect-error - default icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type MapPreviewProps = {
  latitude: number;
  longitude: number;
  polygon: LatLng[];
};

export default function MapPreview({ latitude, longitude, polygon }: MapPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: [latitude || 36.7538, longitude || 3.0589],
      zoom: 15,
      zoomControl: true,
      dragging: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    if (latitude && longitude) {
      L.marker([latitude, longitude]).addTo(map).bindPopup("Location");
    }

    if (polygon && polygon.length >= 3) {
      L.polygon(polygon.map((p) => [p.lat, p.lng]), {
        color: "#38bdf8",
        fillColor: "#38bdf8",
        fillOpacity: 0.2,
        weight: 2,
      }).addTo(map);

      const bounds = L.latLngBounds(polygon.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      className="h-80 w-full rounded-2xl border border-white/10 overflow-hidden"
      style={{ background: "#0f172a" }}
    />
  );
}
