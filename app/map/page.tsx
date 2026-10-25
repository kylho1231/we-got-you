"use client";

import React, { useState, useMemo } from "react";
import { DataStore } from "@/lib/store";
import { MapLibreMap } from "@/components/map/MapLibreMap";
import { SERVICE_CATEGORIES } from "@/data/seed_data";
import { Provider } from "@/types";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { MapPin, Filter, Layers } from "lucide-react";
import { RequestQuoteModal } from "@/components/booking/RequestQuoteModal";

export default function MapPage() {
  const store = DataStore.getInstance();
  const allProviders = useMemo(() => store.getProviders().filter((p) => p.isPublished), [store]);

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [quoteProvider, setQuoteProvider] = useState<Provider | null>(null);

  const filteredProviders = useMemo(() => {
    if (selectedCategory === "ALL") return allProviders;
    return allProviders.filter((p) => p.category === selectedCategory);
  }, [allProviders, selectedCategory]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 dark:bg-midnight">
      {/* Category Filter Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 sm:px-6 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-1.5 shrink-0">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-2">
            Filter Map:
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
              selectedCategory === "ALL"
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
            }`}
          >
            All Providers ({allProviders.length})
          </button>

          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                selectedCategory === cat.name
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="flex-1 relative">
        <MapLibreMap
          providers={filteredProviders}
          selectedProvider={selectedProvider}
          onSelectProvider={(p) => setSelectedProvider(p)}
          className="w-full h-full rounded-none border-none shadow-none"
        />
      </div>

      {quoteProvider && (
        <RequestQuoteModal
          isOpen={Boolean(quoteProvider)}
          onClose={() => setQuoteProvider(null)}
          targetProvider={quoteProvider}
        />
      )}
    </div>
  );
}
