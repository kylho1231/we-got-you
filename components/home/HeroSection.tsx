"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShieldAlert,
  Wrench,
  MapPin,
  Sparkles,
  PhoneCall,
  Mic,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { VoiceTriageModal } from "@/components/assistant/VoiceTriageModal";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/find-repairers?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const quickProblems = [
    { label: "Flat tire / Vulcanizing", query: "flat tire" },
    { label: "Broken phone screen", query: "screen" },
    { label: "Dead car/motor battery", query: "battery" },
    { label: "Aircon not cooling", query: "aircon" },
    { label: "Laptop won't turn on", query: "laptop" },
  ];

  return (
    <section className="relative overflow-hidden bg-white dark:bg-midnight border-b border-slate-200 dark:border-slate-800 pt-8 pb-14 sm:pt-14 sm:pb-20">
      {/* Light subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 bg-brand-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Main Header & Subtitle */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-cyan-300 text-xs font-bold border border-brand-200 dark:border-brand-800">
            <MapPin className="h-3.5 w-3.5 text-brand-600 dark:text-cyan-400" />
            <span>San Jose de Buenavista, Antique</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            What do you need help with right now?
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connect with 48 real repair shops, mechanics, and emergency roadside technicians in San Jose de Buenavista. Honest pricing, direct calls, no fake listings.
          </p>
        </div>

        {/* ========================================================= */}
        {/* THE 3 CLEAR DOORS (The intuitive 3-door entry system)     */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {/* DOOR 1: EMERGENCY ROADSIDE RESCUE */}
          <Link
            href="/roadside-assistance"
            className="group relative p-6 rounded-3xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg hover:shadow-red-600/30 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer min-h-[220px]"
          >
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm text-white">
                  <ShieldAlert className="h-7 w-7" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
                  Urgent / On-Call
                </span>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight">Roadside Rescue</h2>
                <p className="text-xs text-rose-100 mt-1 leading-relaxed">
                  Flat motorcycle tire, dead car battery, or engine stall along the road? Get nearest roadside dispatch fast.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs font-bold border-t border-white/20 relative z-10">
              <span>Request Roadside Help</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* DOOR 2: REPAIR A DEVICE OR APPLIANCE */}
          <Link
            href="/find-repairers"
            className="group relative p-6 rounded-3xl bg-gradient-to-br from-brand-600 to-blue-700 text-white shadow-lg hover:shadow-brand-600/30 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer min-h-[220px]"
          >
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm text-white">
                  <Wrench className="h-7 w-7" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
                  48 Local Shops
                </span>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight">Book a Repair</h2>
                <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                  Broken phone screen, laptop issue, aircon cleaning, refrigerator, or plumbing. Compare verified shops.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs font-bold border-t border-white/20 relative z-10">
              <span>Browse All Specialists</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* DOOR 3: EXPLORE SAN JOSE MAP */}
          <Link
            href="/map"
            className="group relative p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg hover:shadow-slate-800/30 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer min-h-[220px]"
          >
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
                  <MapPin className="h-7 w-7" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-full text-cyan-300">
                  Interactive
                </span>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight">Explore Live Map</h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Find verified repair shops near your barangay in San Jose (Funda, Atabay, Poblacion, San Pedro).
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs font-bold border-t border-slate-700 relative z-10">
              <span className="text-cyan-400">Open Antique Map</span>
              <ArrowRight className="h-4 w-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* ========================================================= */}
        {/* VOICE & AI PROBLEM TRIAGE BAR                             */}
        {/* ========================================================= */}
        <div className="max-w-3xl mx-auto space-y-3">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 p-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus-within:border-brand-500 shadow-sm transition-all"
          >
            <div className="flex items-center gap-2 w-full px-2">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Describe your problem in plain words (e.g. flat tire, basag na screen, aircon not cold)..."
                className="w-full text-xs sm:text-sm bg-transparent placeholder:text-slate-400 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            {/* Voice Microphone Triage Button */}
            <button
              type="button"
              onClick={() => setIsVoiceModalOpen(true)}
              aria-label="Voice problem triage"
              className="flex items-center justify-center h-10 w-10 rounded-xl bg-brand-100 hover:bg-brand-200 dark:bg-brand-950 dark:hover:bg-brand-900 text-brand-700 dark:text-cyan-300 transition-colors shrink-0 cursor-pointer"
              title="Speak your problem (Voice Triage)"
            >
              <Mic className="h-5 w-5" />
            </button>

            <Button
              type="submit"
              variant="primary"
              className="font-bold text-xs sm:text-sm px-5 h-10 shrink-0"
            >
              Search
            </Button>
          </form>

          {/* Quick Problem Pills */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium mr-1">
              Popular right now:
            </span>
            {quickProblems.map((p) => (
              <button
                key={p.label}
                onClick={() => router.push(`/find-repairers?q=${encodeURIComponent(p.query)}`)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950 dark:hover:text-cyan-300 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200/60 dark:border-slate-700 cursor-pointer text-xs"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Voice Triage Modal Component */}
      <VoiceTriageModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </section>
  );
}
