import React from "react";
import Link from "next/link";
import { MapPin, CheckCircle, Navigation, Store } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AntiqueExpansionSection() {
  const hubs = [
    {
      name: "San Jose de Buenavista",
      role: "Capital & Launch Hub",
      status: "Active Coverage",
      barangays: "28 Barangays including Funda-Dalipe, Atabay, Poblacion, San Pedro",
      active: true,
    },
    {
      name: "Sibalom",
      role: "Inland Commercial Center",
      status: "Partner Onboarding",
      barangays: "Key trade routes & town center repairers",
      active: false,
    },
    {
      name: "Hamtic",
      role: "Southern Gateway",
      status: "Partner Onboarding",
      barangays: "Coastal highway & junction roadside support",
      active: false,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/30">
              <Navigation className="h-3.5 w-3.5" />
              <span>Provincial Service Footprint</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Built for Antique Province. <br />
              <span className="text-cyan-400">Expanding Across Western Visayas.</span>
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              We started in San Jose de Buenavista to address real local challenges: broken
              appliances in tropical weather, gadgets that need reliable repairs without
              sending them to Iloilo, and motorists stranded along the Antique National
              Highway.
            </p>

            <div className="pt-2">
              <Link href="/become-a-provider">
                <Button variant="accent" size="lg" className="gap-2 font-bold">
                  <Store className="h-5 w-5" />
                  <span>Register Your Repair Shop in Antique</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            {hubs.map((hub) => (
              <div
                key={hub.name}
                className={`p-5 rounded-2xl border transition-colors ${
                  hub.active
                    ? "bg-slate-800/80 border-cyan-500/40"
                    : "bg-slate-800/40 border-slate-700/60 opacity-80"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin
                        className={`h-4 w-4 ${
                          hub.active ? "text-cyan-400" : "text-slate-400"
                        }`}
                      />
                      <h3 className="text-base font-bold text-white">{hub.name}</h3>
                    </div>
                    <p className="text-xs text-cyan-300 font-medium mt-0.5">{hub.role}</p>
                    <p className="text-xs text-slate-400 mt-2">{hub.barangays}</p>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                      hub.active
                        ? "bg-emerald-950/80 text-emerald-300 border-emerald-800"
                        : "bg-slate-700 text-slate-300 border-slate-600"
                    }`}
                  >
                    {hub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
