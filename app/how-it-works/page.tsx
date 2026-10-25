import React from "react";
import Link from "next/link";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, PhoneCall, CheckCircle2, Wrench } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight py-12 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How We Got You Operates
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            From discovering certified repair shops to emergency roadside assistance along Antique’s highways, here is everything you need to know.
          </p>
        </div>

        <HowItWorksSection />

        {/* Deep dive policies */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Authentic Reviews Only
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We never fabricate star ratings. Reviews are unlocked strictly after a service booking has been marked complete by the customer.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <CheckCircle2 className="h-6 w-6 text-brand-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Prior Quotation Approval
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Technicians issue an itemized estimate for labor and required spare parts. Chargeable work begins only once you confirm the quote.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <PhoneCall className="h-6 w-6 text-red-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Emergency Protocol
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our platform coordinates mechanical repairs and tire vulcanizing. For fires, severe accidents, or medical crises, dial 911 immediately.
            </p>
          </div>
        </div>

        <div className="text-center pt-6">
          <Link href="/find-repairers">
            <Button variant="primary" size="lg">
              Explore Available Repairers Now &rarr;
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
