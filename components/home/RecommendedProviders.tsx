"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { DataStore } from "@/lib/store";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { RequestQuoteModal } from "@/components/booking/RequestQuoteModal";
import { Provider } from "@/types";

export function RecommendedProviders() {
  const store = DataStore.getInstance();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [targetProviderForQuote, setTargetProviderForQuote] = useState<Provider | null>(null);

  const allProviders = useMemo(() => {
    return store.getProviders().filter((p) => p.isPublished);
  }, [store]);

  const filterTabs = [
    { label: "All Specialists", value: "ALL" },
    { label: "Gadgets & Phones", value: "Mobile Phone & Gadget Repair" },
    { label: "Computers & Printers", value: "Computer, Laptop & Printer Repair" },
    { label: "Appliance & Aircon", value: "Appliance Repair" },
    { label: "Car & Mechanic", value: "Car & Automotive Services" },
    { label: "Roadside Rescue", value: "Roadside Assistance" },
  ];

  const filteredProviders = useMemo(() => {
    if (selectedCategory === "ALL") return allProviders;
    return allProviders.filter((p) => p.category === selectedCategory);
  }, [allProviders, selectedCategory]);

  return (
    <section className="py-14 sm:py-20 bg-slate-50/60 dark:bg-slate-950/40 border-b border-slate-200/60 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>100% Real Records • No Fabricated Listings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Verified Providers in Antique
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Discovered and verified workshops with genuine customer reviews and confirmed locations.
            </p>
          </div>

          <Link
            href="/find-repairers"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-cyan-400 flex items-center gap-1.5 group shrink-0"
          >
            <span>View All Providers</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedCategory(tab.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                selectedCategory === tab.value
                  ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Provider Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {filteredProviders.slice(0, 6).map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onBookClick={(p) => setTargetProviderForQuote(p)}
            />
          ))}
        </div>

        {/* Quote Modal */}
        {targetProviderForQuote && (
          <RequestQuoteModal
            isOpen={Boolean(targetProviderForQuote)}
            onClose={() => setTargetProviderForQuote(null)}
            targetProvider={targetProviderForQuote}
          />
        )}
      </div>
    </section>
  );
}
