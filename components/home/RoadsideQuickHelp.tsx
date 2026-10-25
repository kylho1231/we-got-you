"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Disc,
  Zap,
  Bike,
  Car,
  Truck,
  ArrowRight,
  PhoneCall,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export function RoadsideQuickHelp() {
  const emergencyIssues = [
    { label: "Flat Tire / Vulcanizing", icon: Disc, issue: "Flat Tire / Vulcanizing" },
    { label: "Dead Battery / Jump-Start", icon: Zap, issue: "Dead Battery / Jump-start" },
    { label: "Motorcycle Breakdown", icon: Bike, issue: "Mechanical Breakdown" },
    { label: "Car Mechanical Stall", icon: Car, issue: "Mechanical Breakdown" },
    { label: "Towing / Recovery Referral", icon: Truck, issue: "Towing / Recovery" },
  ];

  return (
    <section className="py-14 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden border-y border-slate-800">
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-10 border border-red-500/30 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/40">
                <ShieldAlert className="h-4 w-4 animate-pulse" />
                <span>Immediate Roadside Dispatch</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Stuck on the Highway or Backroad? <br />
                <span className="text-red-400">Request Roadside Assistance Fast.</span>
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                Flat motorcycle or car tire? Dead battery at the public market? Request a
                verified local roadside technician in San Jose de Buenavista with
                transparent pricing and active location matching.
              </p>

              {/* Safety Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Confirmed dispatch only (no fake ETAs)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Direct phone coordination with technician</span>
                </div>
              </div>
            </div>

            {/* Right Action Box */}
            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-5 border border-slate-700/80 space-y-3">
              <span className="text-xs font-semibold text-slate-300 block mb-1">
                Select Your Roadside Issue:
              </span>

              <div className="space-y-2">
                {emergencyIssues.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={`/roadside-assistance?issue=${encodeURIComponent(item.issue)}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white transition-colors border border-slate-700 hover:border-red-500/50 group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-red-600/20 text-red-400 group-hover:scale-110 transition-transform">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-medium">{item.label}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-red-400 transition-colors" />
                    </Link>
                  );
                })}
              </div>

              <div className="pt-2">
                <Link href="/roadside-assistance">
                  <Button variant="danger" className="w-full font-bold shadow-lg shadow-red-600/30">
                    Open Emergency Dispatch Wizard &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
