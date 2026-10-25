"use client";

import React, { useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { SERVICE_CATEGORIES } from "@/data/seed_data";
import { DataStore } from "@/lib/store";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params?.category as string;

  const category = SERVICE_CATEGORIES.find((c) => c.slug === slug);
  const store = DataStore.getInstance();

  const matchingProviders = useMemo(() => {
    if (!category) return [];
    return store
      .getProviders()
      .filter((p) => p.isPublished && p.category === category.name);
  }, [category, store]);

  if (!category) {
    return (
      <div className="min-h-screen py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Category Not Found</h2>
        <Link href="/services">
          <Button variant="primary">Back to Services</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight py-10 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs text-brand-600 dark:text-cyan-400 font-semibold mb-3 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Categories</span>
          </Link>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {category.name} in Antique
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Subcategories pill list */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Available Subcategories & Specialties:
          </span>
          <div className="flex flex-wrap gap-2 pt-1">
            {category.subcategories.map((sub) => (
              <span
                key={sub}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>

        {/* Matching Providers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Verified Providers in San Jose de Buenavista ({matchingProviders.length})
            </h2>
          </div>

          {matchingProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingProviders.map((prov) => (
                <ProviderCard key={prov.id} provider={prov} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 p-8 space-y-2">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No active partners currently listed in this category yet.
              </p>
              <p className="text-xs text-slate-500">
                Are you a technician or repair shop in Antique? Register your business today.
              </p>
              <div className="pt-2">
                <Link href="/become-a-provider">
                  <Button variant="primary" size="sm">
                    Join as a Provider
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
