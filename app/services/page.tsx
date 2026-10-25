import React from "react";
import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Refrigerator,
  Car,
  Bike,
  Wrench,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { SERVICE_CATEGORIES } from "@/data/seed_data";
import { Button } from "@/components/ui/Button";

const ICONS: Record<string, React.ElementType> = {
  Smartphone,
  Laptop,
  Refrigerator,
  Car,
  Bike,
  Wrench,
  ShieldAlert,
};

export default function ServicesIndexPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight py-10 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-brand-600 dark:text-cyan-400 uppercase tracking-wider">
            San Jose de Buenavista Service Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Comprehensive Repair & Maintenance Services
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Browse our hierarchical category system connecting you with specialized technicians across Antique Province.
          </p>
        </div>

        {/* 7 Core Categories Full Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICE_CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.iconName] || Wrench;
            const isRoadside = cat.slug === "roadside-assistance";

            return (
              <div
                key={cat.id}
                className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                  isRoadside
                    ? "bg-gradient-to-br from-red-500/10 via-rose-500/5 to-white dark:to-slate-900 border-red-200 dark:border-red-900"
                    : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ${
                        isRoadside
                          ? "bg-red-600 text-white"
                          : "bg-brand-600 text-white"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {cat.name}
                      </h2>
                      <span className="text-xs text-slate-400">
                        San Jose de Buenavista Hub
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Subcategories bullet list */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Available Specialties & Repairs:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {cat.subcategories.map((sub) => (
                        <div
                          key={sub}
                          className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-brand-600 dark:text-cyan-400 shrink-0" />
                          <span>{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Link
                    href={`/find-repairers?category=${encodeURIComponent(cat.name)}`}
                  >
                    <Button
                      variant={isRoadside ? "danger" : "primary"}
                      size="sm"
                      className="text-xs font-semibold"
                    >
                      Browse {cat.name} &rarr;
                    </Button>
                  </Link>

                  {isRoadside && (
                    <Link href="/roadside-assistance">
                      <Button variant="outline" size="sm" className="text-xs text-red-600 border-red-200">
                        Emergency Rescue
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
