"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShieldAlert,
  Wrench,
  CheckCircle2,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Bike,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const quickPills = [
    { label: "Broken phone screen", query: "screen" },
    { label: "Flat motorcycle tire", query: "flat tire" },
    { label: "Refrigerator not cooling", query: "refrigerator" },
    { label: "Car battery problem", query: "battery" },
    { label: "Air conditioner repair", query: "aircon" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/find-repairers?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handlePillClick = (query: string) => {
    router.push(`/find-repairers?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 dark:from-midnight dark:via-slate-950 dark:to-midnight pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/60 dark:border-slate-800">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-brand-400/10 via-cyan-400/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headlines & Search */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/80 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 text-xs font-semibold border border-brand-200 dark:border-brand-800">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>San Jose de Buenavista & Antique Province Hub</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Something Broken? <br />
              <span className="bg-gradient-to-r from-brand-600 via-blue-700 to-cyan-500 bg-clip-text text-transparent">
                We Got You.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Find trusted local repairers, mechanics, appliance technicians, and
              emergency roadside assistance in Antique. Compare genuine ratings, request
              transparent quotations, and get fast local help.
            </p>

            {/* Prominent Search Bar */}
            <form
              onSubmit={handleSearch}
              className="relative max-w-2xl mx-auto lg:mx-0 shadow-lg rounded-2xl bg-white dark:bg-slate-900 p-2 border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all"
            >
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-2 w-full px-3 py-1.5">
                  <Search className="h-5 w-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What do you need help with? (e.g. flat tire, aircon, phone screen)"
                    className="w-full text-sm bg-transparent placeholder:text-slate-400 text-slate-900 dark:text-white focus:outline-none"
                    aria-label="Search for repair services or problem descriptions"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full sm:w-auto shrink-0 font-semibold px-6 shadow-md"
                >
                  Find Help
                </Button>
              </div>
            </form>

            {/* Suggested Quick Searches */}
            <div className="pt-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium mr-2 block sm:inline mb-1.5 sm:mb-0">
                Popular in Antique:
              </span>
              <div className="inline-flex flex-wrap gap-1.5 justify-center lg:justify-start">
                {quickPills.map((pill) => (
                  <button
                    key={pill.label}
                    onClick={() => handlePillClick(pill.query)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950/50 dark:hover:text-cyan-400 transition-colors border border-slate-200/80 dark:border-slate-700 cursor-pointer"
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-3">
              <Link href="/find-repairers" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full gap-2">
                  <Wrench className="h-5 w-5" />
                  <span>Find a Repairer</span>
                </Button>
              </Link>

              <Link href="/roadside-assistance" className="w-full sm:w-auto">
                <Button
                  variant="danger"
                  size="lg"
                  className="w-full gap-2 font-bold shadow-md shadow-red-600/20"
                >
                  <ShieldAlert className="h-5 w-5" />
                  <span>Get Roadside Help</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: 3D / Interactive Motion Feature Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-brand-950 p-6 sm:p-8 text-white shadow-2xl border border-slate-800 overflow-hidden">
              {/* Glow Accent */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-brand-600/20 rounded-full blur-2xl" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      Live Local Network
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">San Jose Hub</span>
                </div>

                {/* Simulated Interactive Dispatch Preview */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          Cellu-Zite Repair Shop
                        </div>
                        <div className="text-[11px] text-slate-400">Villavert-Jimenez, Brgy. 6</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                      Verified
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
                        <Bike className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          ARS Vulcanizing & Rescue
                        </div>
                        <div className="text-[11px] text-slate-400">San Pedro • Roadside Active</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800">
                      On-Call
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                        <Wrench className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          Rapidé San Jose
                        </div>
                        <div className="text-[11px] text-slate-400">Gen. Fullon • Auto Workshop</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800">
                      4.9 ★ (22)
                    </span>
                  </div>
                </div>

                {/* Bottom Trust Metrics */}
                <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-black text-cyan-400">34+</div>
                    <div className="text-[11px] text-slate-400">Researched Antique Shops</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">₱0</div>
                    <div className="text-[11px] text-slate-400">Customer Booking Fee</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
