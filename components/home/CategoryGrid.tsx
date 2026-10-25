"use client";

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
} from "lucide-react";
import { SERVICE_CATEGORIES } from "@/data/seed_data";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = {
  Smartphone,
  Laptop,
  Refrigerator,
  Car,
  Bike,
  Wrench,
  ShieldAlert,
};

export function CategoryGrid() {
  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-midnight transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <span>Comprehensive Local Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              What Problem Needs Solving?
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Browse by verified local service categories in San Jose de Buenavista.
            </p>
          </div>

          <Link
            href="/services"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-cyan-400 flex items-center gap-1.5 group"
          >
            <span>Explore All Categories</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {SERVICE_CATEGORIES.map((category) => {
            const Icon = ICONS[category.iconName] || Wrench;
            const isRoadside = category.slug === "roadside-assistance";

            return (
              <Link
                key={category.id}
                href={`/find-repairers?category=${encodeURIComponent(category.name)}`}
                className={cn(
                  "group relative p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 cursor-pointer",
                  isRoadside
                    ? "bg-gradient-to-br from-red-500/10 via-rose-500/5 to-transparent border-red-200 dark:border-red-900/60"
                    : "bg-slate-50/60 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-800/80 border-slate-200/80 dark:border-slate-800"
                )}
              >
                <div>
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl mb-4 transition-transform group-hover:scale-110 shadow-sm",
                      isRoadside
                        ? "bg-red-600 text-white shadow-red-600/30"
                        : "bg-white dark:bg-slate-800 text-brand-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700"
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-400 transition-colors">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-500 dark:text-slate-400">
                    {category.subcategories.length} specialties
                  </span>
                  <span className="text-brand-600 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold">
                    Find Help <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
