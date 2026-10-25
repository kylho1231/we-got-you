"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  MapPin,
  ShieldCheck,
  Star,
  Layers,
  Map as MapIcon,
  List,
  Store,
  Home,
  ShieldAlert,
} from "lucide-react";
import { DataStore } from "@/lib/store";
import { Provider, ServiceMode } from "@/types";
import { SERVICE_CATEGORIES, SAN_JOSE_BARANGAYS } from "@/data/seed_data";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { MapLibreMap } from "@/components/map/MapLibreMap";
import { RequestQuoteModal } from "@/components/booking/RequestQuoteModal";
import { Button } from "@/components/ui/Button";

function FindRepairersContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "ALL";

  const store = DataStore.getInstance();
  const allProviders = useMemo(() => store.getProviders().filter((p) => p.isPublished), [store]);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBarangay, setSelectedBarangay] = useState("ALL");
  const [selectedServiceMode, setSelectedServiceMode] = useState<string>("ALL");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "split" | "map">("list");
  const [targetProviderForQuote, setTargetProviderForQuote] = useState<Provider | null>(null);

  // Filter logic
  const filteredProviders = useMemo(() => {
    return allProviders.filter((p) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.businessName.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesSpecialty = p.specialties.some((s) => s.toLowerCase().includes(q));
        const matchesService = p.services.some((s) => s.title.toLowerCase().includes(q));
        if (!matchesName && !matchesCat && !matchesDesc && !matchesSpecialty && !matchesService) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "ALL" && p.category !== selectedCategory) {
        return false;
      }

      // Barangay filter
      if (selectedBarangay !== "ALL" && p.barangay !== selectedBarangay) {
        return false;
      }

      // Service mode filter
      if (selectedServiceMode !== "ALL" && !p.serviceModes.includes(selectedServiceMode as ServiceMode)) {
        return false;
      }

      // Verified only
      if (verifiedOnly && p.verificationStatus !== "APPROVED") {
        return false;
      }

      return true;
    });
  }, [
    allProviders,
    searchQuery,
    selectedCategory,
    selectedBarangay,
    selectedServiceMode,
    verifiedOnly,
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight pb-20">
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Find Repairers & Technicians
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Search real service providers in San Jose de Buenavista, Antique with genuine ratings and verified locations.
            </p>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shop, specialty, or problem (e.g. brakes, screen, aircon)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="ALL">All Categories</option>
                {SERVICE_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={selectedBarangay}
                onChange={(e) => setSelectedBarangay(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="ALL">All Barangays</option>
                {SAN_JOSE_BARANGAYS.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="md:col-span-2 flex items-center justify-end gap-1">
              <button
                onClick={() => setViewMode("list")}
                aria-label="List View"
                className={`p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                  viewMode === "list"
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("split")}
                aria-label="Split Map & List View"
                className={`hidden lg:flex p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                  viewMode === "split"
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                <Layers className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("map")}
                aria-label="Map View"
                className={`p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                  viewMode === "map"
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                <MapIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Filter Badges */}
          <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
            <span className="text-slate-400 font-medium">Mode:</span>
            <button
              onClick={() => setSelectedServiceMode("ALL")}
              className={`px-2.5 py-1 rounded-lg border cursor-pointer ${
                selectedServiceMode === "ALL"
                  ? "bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
              }`}
            >
              Any Mode
            </button>
            <button
              onClick={() => setSelectedServiceMode("SHOP_VISIT")}
              className={`px-2.5 py-1 rounded-lg border cursor-pointer ${
                selectedServiceMode === "SHOP_VISIT"
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
              }`}
            >
              Shop Visit
            </button>
            <button
              onClick={() => setSelectedServiceMode("HOME_SERVICE")}
              className={`px-2.5 py-1 rounded-lg border cursor-pointer ${
                selectedServiceMode === "HOME_SERVICE"
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
              }`}
            >
              Home Service
            </button>
            <button
              onClick={() => setSelectedServiceMode("ROADSIDE_ASSISTANCE")}
              className={`px-2.5 py-1 rounded-lg border cursor-pointer ${
                selectedServiceMode === "ROADSIDE_ASSISTANCE"
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
              }`}
            >
              Roadside Assistance
            </button>

            <span className="text-slate-300 dark:text-slate-700">|</span>

            <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="font-semibold text-xs">Verified Partners Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Results Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <div>
            Showing <strong className="text-slate-900 dark:text-white">{filteredProviders.length}</strong>{" "}
            verified provider{filteredProviders.length === 1 ? "" : "s"} in Antique
          </div>
        </div>

        {viewMode === "list" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onBookClick={(p) => setTargetProviderForQuote(p)}
              />
            ))}
          </div>
        )}

        {viewMode === "map" && (
          <div className="space-y-4">
            <MapLibreMap
              providers={filteredProviders}
              className="w-full h-[650px]"
            />
          </div>
        )}

        {viewMode === "split" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 space-y-4 max-h-[750px] overflow-y-auto pr-2">
              {filteredProviders.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  onBookClick={(p) => setTargetProviderForQuote(p)}
                />
              ))}
            </div>
            <div className="lg:col-span-6 sticky top-20">
              <MapLibreMap
                providers={filteredProviders}
                className="w-full h-[720px]"
              />
            </div>
          </div>
        )}

        {filteredProviders.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No matching providers found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try broadening your search keywords or switching category/barangay filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
                setSelectedBarangay("ALL");
                setSelectedServiceMode("ALL");
                setVerifiedOnly(false);
              }}
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </div>

      {targetProviderForQuote && (
        <RequestQuoteModal
          isOpen={Boolean(targetProviderForQuote)}
          onClose={() => setTargetProviderForQuote(null)}
          targetProvider={targetProviderForQuote}
        />
      )}
    </div>
  );
}

export default function FindRepairersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-20 text-center text-xs text-slate-400">
          Loading Antique Repairers Directory...
        </div>
      }
    >
      <FindRepairersContent />
    </Suspense>
  );
}
