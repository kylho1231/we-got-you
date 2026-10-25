"use client";

import React, { useEffect, useRef, useState } from "react";
import { Provider, ProviderLead } from "@/types";
import { MapPin, Navigation, ExternalLink, ShieldCheck, Star, Wrench, Store, Info, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface MapLibreMapProps {
  providers: Provider[];
  leads?: ProviderLead[];
  selectedProvider?: Provider | null;
  onSelectProvider?: (provider: Provider) => void;
  className?: string;
  showLeadsToggle?: boolean;
}

export function MapLibreMap({
  providers,
  leads = [],
  selectedProvider,
  onSelectProvider,
  className = "w-full h-[550px]",
  showLeadsToggle = true,
}: MapLibreMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showDiscoveredLeads, setShowDiscoveredLeads] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [activePopupProvider, setActivePopupProvider] = useState<Provider | null>(
    selectedProvider || null
  );
  const [activePopupLead, setActivePopupLead] = useState<ProviderLead | null>(null);

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

  // Update markers when providers, leads, or showDiscoveredLeads changes
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    import("maplibre-gl").then(({ default: maplibregl }) => {
      // 1. Render Registered / Verified Providers
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
          " title="${prov.businessName} (${prov.category})">
            <svg style="width: 16px; height: 16px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        `;

        el.addEventListener("click", () => {
          setActivePopupProvider(prov);
          setActivePopupLead(null);
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

      // 2. Render Discovered Antique Directory Leads with Resolved GPS (Unclaimed)
      if (showDiscoveredLeads && leads && leads.length > 0) {
        leads.forEach((lead) => {
          if (!lead.hasResolvedCoordinates || !lead.coordinates) return;
          // Avoid duplicating pins for leads already promoted to active providers
          if (providers.some((p) => p.sourceLeadId === lead.id)) return;

          const el = document.createElement("div");
          el.className = "cursor-pointer transition-transform hover:scale-125";
          el.innerHTML = `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 28px;
              height: 28px;
              border-radius: 9999px;
              background-color: #D97706;
              color: white;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
              border: 2px solid white;
            " title="${lead.name} • Discovered Antique Shop (${lead.category})">
              <svg style="width: 14px; height: 14px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
          `;

          el.addEventListener("click", () => {
            setActivePopupLead(lead);
            setActivePopupProvider(null);
            mapInstanceRef.current.flyTo({
              center: [lead.coordinates!.lng, lead.coordinates!.lat],
              zoom: 15,
            });
          });

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([lead.coordinates.lng, lead.coordinates.lat])
            .addTo(mapInstanceRef.current);

          markersRef.current.push(marker);
        });
      }
    });
  }, [mapLoaded, providers, leads, showDiscoveredLeads, onSelectProvider]);

  // Center on selected provider when changed from props
  useEffect(() => {
    if (selectedProvider && mapInstanceRef.current) {
      setActivePopupProvider(selectedProvider);
      setActivePopupLead(null);
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
      () => {
        alert("Location access denied or unavailable. You can use manual barangay search.");
      }
    );
  };

  const resolvedLeadsCount = leads.filter(
    (l) => l.hasResolvedCoordinates && !providers.some((p) => p.sourceLeadId === l.id)
  ).length;

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl ${className}`}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Action Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        <button
          onClick={handleLocateMe}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-semibold shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
        >
          <Navigation className="h-4 w-4 text-brand-600 dark:text-cyan-400" />
          <span>Locate Me</span>
        </button>

        {showLeadsToggle && resolvedLeadsCount > 0 && (
          <button
            onClick={() => setShowDiscoveredLeads(!showDiscoveredLeads)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold shadow-md transition-colors border cursor-pointer ${
              showDiscoveredLeads
                ? "bg-amber-500 text-slate-950 border-amber-400"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
            }`}
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>Discovered Shops ({resolvedLeadsCount})</span>
          </button>
        )}
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
                <MapPin className="h-3 w-3 text-brand-500" />
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
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-medium cursor-pointer"
                title="Open in Navigation App"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <Link href={`/repairers/${activePopupProvider.slug}`}>
                <Button variant="primary" size="sm" className="text-xs py-1 px-3 cursor-pointer">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Discovered Antique Lead Preview Overlay Drawer */}
      {activePopupLead && activePopupLead.coordinates && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-amber-300 dark:border-amber-800/80 animate-slide-up">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 uppercase tracking-wider">
                  Discovered Shop ({activePopupLead.id})
                </span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  {activePopupLead.category}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">
                {activePopupLead.name}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 text-amber-500 shrink-0" />
                <span className="line-clamp-1">{activePopupLead.location}</span>
              </p>
            </div>

            <button
              onClick={() => setActivePopupLead(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 text-xs"
              aria-label="Close preview"
            >
              ✕
            </button>
          </div>

          <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
            {activePopupLead.services}
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
              {activePopupLead.coordinates.lat.toFixed(5)}, {activePopupLead.coordinates.lng.toFixed(5)}
            </span>
            {activePopupLead.plusCode && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono">
                {activePopupLead.plusCode}
              </span>
            )}
            {activePopupLead.phone && (
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                📞 {activePopupLead.phone}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              {activePopupLead.mapPrecision || "Third-party map pin"}
            </div>

            <div className="flex items-center gap-1.5">
              {activePopupLead.googleMapsPinUrl ? (
                <a
                  href={activePopupLead.googleMapsPinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-medium cursor-pointer"
                  title="Open exact pin in Google Maps"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${activePopupLead.coordinates.lat},${activePopupLead.coordinates.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-medium cursor-pointer"
                  title="Navigate with GPS"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              <Link href={`/provider/onboarding?claimLead=${activePopupLead.id}`}>
                <Button variant="primary" size="sm" className="text-xs py-1 px-3 bg-amber-600 hover:bg-amber-500 cursor-pointer">
                  Claim Listing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
