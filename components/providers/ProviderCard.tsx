"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  ShieldCheck,
  Phone,
  Wrench,
  Store,
  Home,
  ShieldAlert,
  Heart,
  Calendar,
} from "lucide-react";
import { Provider } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { DataStore } from "@/lib/store";

interface ProviderCardProps {
  provider: Provider;
  onBookClick?: (provider: Provider) => void;
  showFavoriteButton?: boolean;
}

export function ProviderCard({
  provider,
  onBookClick,
  showFavoriteButton = true,
}: ProviderCardProps) {
  const store = DataStore.getInstance();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(store.getFavorites().includes(provider.id));
  }, [provider.id, store]);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const toggled = store.toggleFavorite(provider.id);
    setIsFav(toggled);
  };

  const isVerified = provider.verificationStatus === "APPROVED";
  const hasRoadside =
    provider.serviceModes.includes("ROADSIDE_ASSISTANCE") && provider.isRoadsideActive;

  return (
    <div className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div className="p-5 space-y-3">
        {/* Top Badges & Favorite */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-brand-700 dark:text-cyan-400">
              {provider.category}
            </span>

            {isVerified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Verified Shop
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[11px]">
                Community Listing
              </span>
            )}

            {hasRoadside && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 text-[11px] font-bold border border-red-200 dark:border-red-800">
                <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
                Roadside Active
              </span>
            )}
          </div>

          {showFavoriteButton && (
            <button
              type="button"
              onClick={handleFavoriteToggle}
              aria-label={isFav ? "Remove from favorites" : "Save to favorites"}
              className={cn(
                "p-2 rounded-xl transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center",
                isFav
                  ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
                  : "bg-slate-100 text-slate-400 hover:text-slate-600 dark:bg-slate-800 dark:text-slate-500"
              )}
            >
              <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
            </button>
          )}
        </div>

        {/* Shop Business Name */}
        <Link href={`/repairers/${provider.slug}`} className="block">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-400 transition-colors">
            {provider.businessName}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="font-medium">
            {provider.barangay}, {provider.municipality}
          </span>
        </div>

        {/* What They Fix (Specialties) */}
        <div className="pt-1">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
            Services & Repairs:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {provider.specialties.slice(0, 3).map((spec) => (
              <span
                key={spec}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Service Modes */}
        <div className="flex items-center gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
          {provider.serviceModes.includes("SHOP_VISIT") && (
            <span className="inline-flex items-center gap-1">
              <Store className="h-3.5 w-3.5 text-slate-400" /> Walk-in Shop
            </span>
          )}
          {provider.serviceModes.includes("HOME_SERVICE") && (
            <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <Home className="h-3.5 w-3.5" /> Home Service
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons: CALL SHOP & REQUEST QUOTE */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2">
        {/* Direct Call Button */}
        <a
          href={`tel:${provider.contactPhone}`}
          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors min-h-[44px] cursor-pointer"
        >
          <Phone className="h-4 w-4" />
          <span>Call Shop</span>
        </a>

        {/* Request Quote or View Profile */}
        {onBookClick ? (
          <button
            type="button"
            onClick={() => onBookClick(provider)}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-colors min-h-[44px] cursor-pointer"
          >
            <Calendar className="h-4 w-4" />
            <span>Request Quote</span>
          </button>
        ) : (
          <Link
            href={`/repairers/${provider.slug}`}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-semibold transition-colors min-h-[44px]"
          >
            <Wrench className="h-4 w-4" />
            <span>View Details</span>
          </Link>
        )}
      </div>
    </div>
  );
}
