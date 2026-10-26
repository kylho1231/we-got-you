"use client";

import React from "react";
import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Refrigerator,
  Bike,
  Car,
  Wrench,
  ArrowRight,
} from "lucide-react";

export function CategoryGrid() {
  const categories = [
    {
      title: "Mobile Phones & Gadgets",
      description: "Screen replacement, battery, charging port, and water-damage repair.",
      icon: Smartphone,
      categoryQuery: "Mobile Phone & Gadget Repair",
      colorClass: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-900",
    },
    {
      title: "Laptops, PC & Printers",
      description: "Hardware diagnostics, format/OS install, keyboard, and printer servicing.",
      icon: Laptop,
      categoryQuery: "Computer, Laptop & Printer Repair",
      colorClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900",
    },
    {
      title: "Appliances & Aircon",
      description: "Refrigerators, air conditioning cleaning & repair, washing machines.",
      icon: Refrigerator,
      categoryQuery: "Appliance Repair",
      colorClass: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900",
    },
    {
      title: "Motorcycles & Scooters",
      description: "Emergency vulcanizing, engine tune-up, chains, brakes, and rescue.",
      icon: Bike,
      categoryQuery: "Motorcycle Services",
      colorClass: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900",
    },
    {
      title: "Car & Auto Services",
      description: "Battery jump-start, tire change, mechanical troubleshooting, AC repair.",
      icon: Car,
      categoryQuery: "Car & Automotive Services",
      colorClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
    },
    {
      title: "Home Plumbing & Electrical",
      description: "Water leaks, water pumps, electrical troubleshooting, and minor repairs.",
      icon: Wrench,
      categoryQuery: "Home Maintenance",
      colorClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-slate-50/50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Browse by What Needs Repair
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select a category to view verified technicians and shops in San Jose de Buenavista.
            </p>
          </div>

          <Link
            href="/find-repairers"
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 dark:text-cyan-400 flex items-center gap-1 group shrink-0"
          >
            <span>View All 48 Shops</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                href={`/find-repairers?category=${encodeURIComponent(cat.categoryQuery)}`}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 shadow-sm hover:shadow-md transition-all duration-200 flex items-start gap-4 cursor-pointer"
              >
                <div
                  className={`p-3 rounded-2xl border shrink-0 transition-transform group-hover:scale-105 ${cat.colorClass}`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
