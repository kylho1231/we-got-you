"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  ShieldCheck,
  Map as MapIcon,
  List,
  Wrench,
  Phone,
  Calendar,
} from "lucide-react";
import { DataStore } from "@/lib/store";
import { Provider, ServiceMode } from "@/types";
import { SERVICE_CATEGORIES, SAN_JOSE_BARANGAYS } from "@/data/seed_data";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { MapLibreMap } from "@/components/map/MapLibreMap";
import { RequestQuoteModal } from "@/components/booking/RequestQuoteModal";

function FindRepairersContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "ALL";

  const store = DataStore.getInstance();
  const allProviders = useMemo(() => store.getProviders().filter((p) => p.isPublished), [store]);
  const allLeads = useMemo(() => store.getLeads().filter((l) => l.hasResolvedCoordinates), [store]);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBarangay, setSelectedBarangay] = useState("ALL");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [targetProviderForQuote, setTargetProviderForQuote] = useState<Provider | null>(null);

  // Fast Category Filter Pills
  const categoryPills = [
    { label: "All Shops", value: "ALL" },
    { label: "Phones & Gadgets", value: "Mobile Phone & Gadget Repair" },
    { label: "Computers & PC", value: "Computer, Laptop & Printer Repair" },
    { label: "Appliances & AC", value: "Appliance Repair" },
    { label: "Motorcycles", value: "Motorcycle Services" },
    { label: "Car & Auto", value: "Car & Automotive Services" },
    { label: "Home Repairs", value: "Home Maintenance" },
  ];

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

      // Verified only
      if (verifiedOnly && p.verificationStatus !== "APPROVED") {
        return false;
      }

      return true;
    });
  }, [allProviders, searchQuery, selectedCategory, selectedBarangay, verifiedOnly]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight pb-24">
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Repair Shops in San Jose de Buenavista
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Find verified local technicians and workshops. Call directly or request a quotation.
            </p>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by problem (e.g. brakes, screen, aircon) or shop name..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[44px]"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedBarangay}
                onChange={(e) => setSelectedBarangay(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[44px]"
              >
                <option value="ALL">All 28 Barangays</option>
                {SAN_JOSE_BARANGAYS.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle: List vs Map */}
            <div className="sm:col-span-2 flex items-center justify-end gap-1">
              <button
                onClick={() => setViewMode("list")}
                aria-label="List View"
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-colors min-h-[44px] ${
                  viewMode === "list"
                    ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                <List className="h-4 w-4" />
                <span>List</span>
              </button>
              <button
                onClick={() => setViewMode("map")}
                aria-label="Map View"
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-colors min-h-[44px] ${
                  viewMode === "map"
                    ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                <MapIcon className="h-4 w-4" />
                <span>Map</span>
              </button>
            </div>
          </div>

          {/* Category Horizontal Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categoryPills.map((pill) => (
              <button
                key={pill.value}
                onClick={() => setSelectedCategory(pill.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border min-h-[36px] ${
                  selectedCategory === pill.value
                    ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Results Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <div>
            Showing <strong className="text-slate-900 dark:text-white">{filteredProviders.length}</strong>{" "}
            repair shop{filteredProviders.length === 1 ? "" : "s"} in San Jose, Antique
          </div>

          <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 h-4 w-4"
            />
            <span className="font-semibold text-xs">Verified Only</span>
          </label>
        </div>

        {/* View Mode: List or Map */}
        {viewMode === "map" ? (
          <div className="h-[600px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
            <MapLibreMap
              providers={filteredProviders}
              leads={allLeads}
              onSelectProvider={(p) => setTargetProviderForQuote(p)}
              className="h-full w-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.length > 0 ? (
              filteredProviders.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  onBookClick={(p) => setTargetProviderForQuote(p)}
                />
              ))
            ) : (
              <div className="col-span-full py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <Wrench className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  No repair shops matched your filters
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try searching with different terms, selecting "All Categories", or choosing "All 28 Barangays".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("ALL");
                    setSelectedBarangay("ALL");
                    setVerifiedOnly(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quote Booking Modal */}
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-midnight">
          <div className="text-center space-y-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent mx-auto" />
            <p className="text-xs text-slate-500">Loading San Jose Repair Shops...</p>
          </div>
        </div>
      }
    >
      <FindRepairersContent />
    </Suspense>
  );
}
