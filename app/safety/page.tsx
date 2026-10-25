import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  PhoneCall,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight py-12 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-bold border border-red-200 dark:border-red-800">
            <ShieldAlert className="h-4 w-4" />
            <span>Trust, Safety & Emergency Protocols</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Safety Standards at We Got You
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Your physical safety, consumer rights, and privacy are core requirements.
            Read our protocols for emergency situations and technician engagement.
          </p>
        </div>

        {/* Life-Threatening Emergency Warning Callout */}
        <div className="p-6 rounded-3xl bg-red-600 text-white space-y-4 shadow-xl shadow-red-600/20">
          <div className="flex items-center gap-3">
            <PhoneCall className="h-6 w-6 animate-pulse" />
            <h2 className="text-lg font-bold">Official Emergency Protocol (Unified 911)</h2>
          </div>
          <p className="text-xs text-red-100 leading-relaxed">
            <strong>WE GOT YOU IS A COMMERCIAL REPAIR MARKETPLACE</strong> connecting users
            with private repair technicians, vulcanizers, and towing referrals. We are{" "}
            <strong>NOT</strong> a substitute for official municipal emergency response
            services.
          </p>
          <div className="p-4 rounded-2xl bg-red-700/80 text-xs space-y-2">
            <p className="font-semibold text-white">
              If an incident involves vehicular collisions with physical injuries, fires,
              fuel leaks, or immediate threat to life:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-red-100">
              <li>Immediately dial <strong>911</strong> (National Emergency Hotline).</li>
              <li>Contact PNP Antique Provincial Police: <strong>0998 598 6236</strong></li>
              <li>Contact BFP San Jose Fire Station: <strong>0915 487 7509</strong></li>
            </ul>
          </div>
        </div>

        {/* Safety Pillars */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Multi-Point Provider Verification
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We audit physical storefronts, confirmed phone numbers, and official
              certifications (such as DTI registration, TESDA NC II accreditation, or
              authorized brand service contracts). We clearly separate verified credentials
              from unverified service claims.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Hazardous Repair Precautions
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Never attempt to diagnose high-voltage components (such as microwave capacitors or
              main electrical circuit breaker boxes) or pressurized refrigerant systems
              without certified training. Always unplug malfunctioning appliances before
              inspection.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <Lock className="h-5 w-5 text-brand-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Data Privacy & Location Protection
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Customer coordinates and home addresses are never published publicly. They are
              disclosed strictly to the provider you choose to contract for a home service or
              roadside rescue. You can always use manual barangay selection if you prefer not
              to grant GPS permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
