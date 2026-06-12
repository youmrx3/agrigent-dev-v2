"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toPng } from "html-to-image";
import { LatLng } from "@/stores/dashboard-store";
import { Search, Crosshair, Map as MapIcon, X } from "lucide-react";

// @ts-expect-error - default icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type SearchResult = {
  display_name: string;
  lat: string;
  lon: string;
};

type MapPickerProps = {
  latitude: number;
  longitude: number;
  polygon: LatLng[];
  address: string;
  onLocationChange: (lat: number, lng: number) => void;
  onPolygonChange: (polygon: LatLng[]) => void;
  onAddressChange: (address: string) => void;
  onSnapshot?: (dataUrl: string) => void;
};

export default function MapPicker({
  latitude,
  longitude,
  polygon,
  address,
  onLocationChange,
  onPolygonChange,
  onAddressChange,
  onSnapshot,
}: MapPickerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const polygonRef = useRef<L.Polygon | null>(null);
  const tempMarkersRef = useRef<L.Marker[]>([]);
  const tempLineRef = useRef<L.Polyline | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const callbacksRef = useRef({ onLocationChange, onPolygonChange, onAddressChange, onSnapshot });
  callbacksRef.current = { onLocationChange, onPolygonChange, onAddressChange, onSnapshot };

  const modeRef = useRef<"marker" | "polygon">("marker");
  const drawingRef = useRef<LatLng[]>([]);

  const [searchQuery, setSearchQuery] = useState(address || "");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [mode, setMode] = useState<"marker" | "polygon">("marker");
  const [polygonPoints, setPolygonPoints] = useState<LatLng[]>(polygon || []);
  const [drawingVertices, setDrawingVertices] = useState<LatLng[]>([]);

  const centerMap = useCallback((lat: number, lng: number) => {
    mapRef.current?.setView([lat, lng], 15);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const hasCoords = latitude && longitude;
    const map = L.map(mapContainerRef.current, {
      center: hasCoords ? [latitude, longitude] : [36.7538, 3.0589],
      zoom: hasCoords ? 15 : 13,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync marker with lat/lng prop
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (latitude && longitude) {
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      } else {
        markerRef.current = L.marker([latitude, longitude], { draggable: true })
          .addTo(map)
          .bindPopup("Land Location");
      }
      markerRef.current.on("dragend", () => {
        const pos = markerRef.current?.getLatLng();
        if (pos) {
          callbacksRef.current.onLocationChange(pos.lat, pos.lng);
        }
      });
    } else {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
  }, [latitude, longitude]);

  // Sync polygon with polygon prop
  useEffect(() => {
    if (polygonRef.current) {
      polygonRef.current.remove();
      polygonRef.current = null;
    }

    const pts = polygon || polygonPoints;
    if (pts.length >= 3) {
      polygonRef.current = L.polygon(pts.map((p) => [p.lat, p.lng]), {
        color: "#38bdf8",
        fillColor: "#38bdf8",
        fillOpacity: 0.2,
        weight: 2,
      }).addTo(mapRef.current!);
    }
  }, [polygon, polygonPoints]);

  // Sync address with search query
  useEffect(() => {
    if (address && address !== searchQuery) {
      setSearchQuery(address);
    }
  }, [address]); // eslint-disable-line react-hooks/exhaustive-deps

  // Search places with debounce
  function handleSearchChange(value: string) {
    setSearchQuery(value);
    callbacksRef.current.onAddressChange(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5`,
          { headers: { "User-Agent": "AGRIGENT/1.0" } }
        );
        const data: SearchResult[] = await res.json();
        setSearchResults(data);
        setShowResults(data.length > 0);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  }

  function selectResult(result: SearchResult) {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setSearchQuery(result.display_name);
    callbacksRef.current.onAddressChange(result.display_name);
    callbacksRef.current.onLocationChange(lat, lng);
    setShowResults(false);
    centerMap(lat, lng);
  }

  function clearDrawing() {
    drawingRef.current = [];
    setDrawingVertices([]);
    tempMarkersRef.current.forEach((m) => m.remove());
    tempMarkersRef.current = [];
    if (tempLineRef.current) {
      tempLineRef.current.remove();
      tempLineRef.current = null;
    }
  }

  function finishPolygon() {
    const pts = drawingRef.current;
    if (pts.length < 3) return;
    setPolygonPoints(pts);
    callbacksRef.current.onPolygonChange(pts);

    // Capture map snapshot
    if (mapRef.current && callbacksRef.current.onSnapshot) {
      const container = mapRef.current.getContainer();
      toPng(container, { quality: 0.8, pixelRatio: 1 })
        .then((dataUrl) => callbacksRef.current.onSnapshot!(dataUrl))
        .catch(() => {});
    }

    clearDrawing();
    setMode("marker");
    modeRef.current = "marker";
  }

  function clearPolygon() {
    setPolygonPoints([]);
    callbacksRef.current.onPolygonChange([]);
    if (polygonRef.current) {
      polygonRef.current.remove();
      polygonRef.current = null;
    }
  }

  function getCurrentLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        callbacksRef.current.onLocationChange(lat, lng);
        centerMap(lat, lng);
      },
      () => {}
    );
  }

  // Map click handler
  function handleMapClick(e: L.LeafletMouseEvent) {
    if (modeRef.current === "marker") {
      callbacksRef.current.onLocationChange(e.latlng.lat, e.latlng.lng);
    } else {
      const point: LatLng = { lat: e.latlng.lat, lng: e.latlng.lng };
      drawingRef.current = [...drawingRef.current, point];
      setDrawingVertices([...drawingRef.current]);

      const marker = L.marker(e.latlng, {
        icon: L.divIcon({
          className: "",
          html: `<div style="width:10px;height:10px;background:#38bdf8;border:2px solid white;border-radius:50%;"></div>`,
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        }),
      }).addTo(mapRef.current!);
      tempMarkersRef.current.push(marker);

      const pts: [number, number][] = drawingRef.current.map((p) => [p.lat, p.lng]);
      if (tempLineRef.current) {
        tempLineRef.current.setLatLngs(pts);
      } else {
        tempLineRef.current = L.polyline(pts, {
          color: "#38bdf8",
          dashArray: "5, 10",
          weight: 2,
        }).addTo(mapRef.current!);
      }
    }
  }

  // Attach/detach map click handler
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.on("click", handleMapClick);
    return () => {
      map.off("click", handleMapClick);
    };
  }, []); // mounted once, uses refs for fresh state

  // Sync modeRef with mode state
  useEffect(() => {
    modeRef.current = mode;
    if (mode === "marker") {
      clearDrawing();
    }
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-3">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 pl-10 pr-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500/50"
            placeholder="Search for a place..."
          />
          {searching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
            </div>
          )}
          {showResults && (
            <div className="absolute top-full left-0 right-0 z-[9999] mt-1 max-h-48 overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
              {searchResults.map((r, i) => (
                <button
                  key={i}
                  onMouseDown={() => selectResult(r)}
                  className="w-full px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-cyan-500/10 hover:text-white border-b border-white/5 last:border-0"
                >
                  <span className="line-clamp-2">{r.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={getCurrentLocation}
          title="Use current location"
          className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-400 transition hover:text-white"
        >
          <Crosshair size={16} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex rounded-2xl border border-white/10 p-1">
          <button
            type="button"
            onClick={() => setMode("marker")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition ${
              mode === "marker"
                ? "bg-cyan-500/20 text-cyan-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MapIcon size={14} />
            Point
          </button>
          <button
            type="button"
            onClick={() => setMode("polygon")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition ${
              mode === "polygon"
                ? "bg-cyan-500/20 text-cyan-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
            </svg>
            Outline
          </button>
        </div>

        {mode === "polygon" && (
          <div className="flex items-center gap-2">
            {drawingVertices.length > 0 && (
              <>
                <span className="text-xs text-slate-500">{drawingVertices.length} point{drawingVertices.length > 1 ? "s" : ""}</span>
                <button
                  type="button"
                  onClick={clearDrawing}
                  className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition hover:text-white"
                >
                  <X size={14} />
                </button>
              </>
            )}
            {drawingVertices.length >= 3 && (
              <button
                type="button"
                onClick={finishPolygon}
                className="rounded-xl bg-cyan-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-400"
              >
                Finish
              </button>
            )}
          </div>
        )}

        {polygonPoints.length >= 3 && mode !== "polygon" && (
          <button
            type="button"
            onClick={clearPolygon}
            className="rounded-xl border border-red-500/30 px-3 py-1.5 text-xs text-red-400 transition hover:border-red-500/50"
          >
            Clear outline
          </button>
        )}

        {mode === "polygon" && (
          <span className="text-xs text-slate-500">
            Click on the map to add points
          </span>
        )}
      </div>

      <div
        ref={mapContainerRef}
        className="h-72 w-full rounded-2xl border border-white/10 overflow-hidden"
        style={{ background: "#0f172a" }}
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-500">Latitude</label>
          <input
            type="number"
            step="any"
            value={latitude === 0 && longitude === 0 && !address ? "" : latitude}
            onChange={(e) => {
              const v = e.target.value === "" ? 0 : parseFloat(e.target.value) || 0;
              callbacksRef.current.onLocationChange(v, longitude);
            }}
            className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-white outline-none"
            placeholder="36.7538"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500">Longitude</label>
          <input
            type="number"
            step="any"
            value={longitude === 0 && latitude === 0 && !address ? "" : longitude}
            onChange={(e) => {
              const v = e.target.value === "" ? 0 : parseFloat(e.target.value) || 0;
              callbacksRef.current.onLocationChange(latitude, v);
            }}
            className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-white outline-none"
            placeholder="3.0589"
          />
        </div>
      </div>
    </div>
  );
}
