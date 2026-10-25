import React from "react";
import { RoadsideRequestWizard } from "@/components/roadside/RoadsideRequestWizard";
import { ShieldAlert, PhoneCall, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function RoadsideAssistancePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 text-red-400 text-xs font-bold border border-red-500/30">
            <ShieldAlert className="h-4 w-4 animate-pulse" />
            <span>Antique Roadside Rescue Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Emergency Roadside Assistance
          </h1>

          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Fast dispatch for flat tires, motorcycle breakdown, battery jump-starts, and
            mechanical rescue across San Jose de Buenavista and surrounding Antique
            highways.
          </p>
        </div>

        {/* Wizard Component */}
        <RoadsideRequestWizard />

        {/* Safety Directives Box */}
        <div className="max-w-2xl mx-auto p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 text-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Driver & Motorist Safety Protocol</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
            <div className="space-y-1">
              <span className="font-semibold text-white block">1. Secure Your Position</span>
              <p className="text-slate-400 text-[11px]">
                Pull as far onto the highway shoulder as possible. Turn hazard flashers on immediately.
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-semibold text-white block">2. Stand Clear of Traffic</span>
              <p className="text-slate-400 text-[11px]">
                Do not stand in the roadway or between stopped vehicles while waiting for the technician.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
