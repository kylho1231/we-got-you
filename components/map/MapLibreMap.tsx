"use client";

import React, { useEffect, useRef, useState } from "react";
import { Provider } from "@/types";
import { MapPin, Navigation, ExternalLink, ShieldCheck, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface MapLibreMapProps {
  providers: Provider[];
  selectedProvider?: Provider | null;
  onSelectProvider?: (provider: Provider) => void;
  className?: string;
}

export function MapLibreMap({
  providers,
  selectedProvider,
  onSelectProvider,
  className = "w-full h-[550px]",
}: MapLibreMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [activePopupProvider, setActivePopupProvider] = useState<Provider | null>(
    selectedProvider || null
  );

  const defaultCenter = { lat: 10.7441, lng: 121.9402 }; // San Jose de Buenavista

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      try {
        const maplibregl = (await import("maplibre-gl")).default;
        // Inject MapLibre CSS if not already present
        if (!document.getElementById("maplibre-css")) {
          const link = document.createElement("link");
          link.id = "maplibre-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/maplibre-gl@5.2.0/dist/maplibre-gl.css";
          document.head.appendChild(link);
        }

        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: {
            version: 8,
            sources: {
              "osm-tiles": {
                type: "raster",
                tiles: [
                  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                ],
                tileSize: 256,
                attribution: "© OpenStreetMap contributors",
              },
            },
            layers: [
              {
                id: "osm-tiles-layer",
                type: "raster",
                source: "osm-tiles",
                minzoom: 0,
                maxzoom: 19,
              },
            ],
          },
          center: [defaultCenter.lng, defaultCenter.lat],
          zoom: 13.5,
        });

        map.addControl(new maplibregl.NavigationControl(), "top-right");

        map.on("load", () => {
          if (isMounted) {
            mapInstanceRef.current = map;
            setMapLoaded(true);
          }
        });
      } catch (err) {
        console.error("MapLibre GL failed to load:", err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when providers or mapLoaded changes
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    import("maplibre-gl").then(({ default: maplibregl }) => {
      providers.forEach((prov) => {
        if (!prov.coordinates?.lat || !prov.coordinates?.lng) return;

        const isRoadside = prov.serviceModes.includes("ROADSIDE_ASSISTANCE");

        // Custom HTML marker
        const el = document.createElement("div");
        el.className = "cursor-pointer transition-transform hover:scale-125";
        el.innerHTML = `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 9999px;
            background-color: ${isRoadside ? "#DC2626" : "#2563EB"};
            color: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
            border: 2px solid white;
          ">
            <svg style="width: 16px; height: 16px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        `;

        el.addEventListener("click", () => {
          setActivePopupProvider(prov);
          if (onSelectProvider) onSelectProvider(prov);
          mapInstanceRef.current.flyTo({
            center: [prov.coordinates.lng, prov.coordinates.lat],
            zoom: 14.5,
          });
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([prov.coordinates.lng, prov.coordinates.lat])
          .addTo(mapInstanceRef.current);

        markersRef.current.push(marker);
      });
    });
  }, [mapLoaded, providers, onSelectProvider]);

  // Center on selected provider when changed from props
  useEffect(() => {
    if (selectedProvider && mapInstanceRef.current) {
      setActivePopupProvider(selectedProvider);
      mapInstanceRef.current.flyTo({
        center: [selectedProvider.coordinates.lng, selectedProvider.coordinates.lat],
        zoom: 15,
      });
    }
  }, [selectedProvider]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo({
            center: [coords.lng, coords.lat],
            zoom: 14.5,
          });

          import("maplibre-gl").then(({ default: maplibregl }) => {
            const userEl = document.createElement("div");
            userEl.innerHTML = `
              <div style="width: 20px; height: 20px; background-color: #06B6D4; border: 3px solid white; border-radius: 9999px; box-shadow: 0 0 10px rgba(6, 182, 212, 0.8);"></div>
            `;
            new maplibregl.Marker({ element: userEl })
              .setLngLat([coords.lng, coords.lat])
              .addTo(mapInstanceRef.current);
          });
        }
      },
      (err) => {
        alert("Location access denied or unavailable. You can use manual barangay search.");
      }
    );
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl ${className}`}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Locate Me Floating Action Button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={handleLocateMe}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-semibold shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
        >
          <Navigation className="h-4 w-4 text-brand-600 dark:text-cyan-400" />
          <span>Locate Me in Antique</span>
        </button>
      </div>

      {/* Active Provider Preview Overlay Drawer */}
      {activePopupProvider && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-slide-up">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-brand-600 dark:text-cyan-400 uppercase tracking-wider">
                {activePopupProvider.category}
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                {activePopupProvider.businessName}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" />
                <span>
                  {activePopupProvider.barangay}, {activePopupProvider.municipality}
                </span>
              </p>
            </div>

            <button
              onClick={() => setActivePopupProvider(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 text-xs"
              aria-label="Close preview"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block">Starting Fee</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {activePopupProvider.minServicePricePhp > 0
                  ? formatCurrency(activePopupProvider.minServicePricePhp)
                  : "On Request"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${activePopupProvider.coordinates.lat},${activePopupProvider.coordinates.lng}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-medium"
                title="Open in Navigation App"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <Link href={`/repairers/${activePopupProvider.slug}`}>
                <Button variant="primary" size="sm" className="text-xs py-1 px-3">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
