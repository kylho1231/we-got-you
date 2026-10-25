"use client";

import React from "react";
import Link from "next/link";
import {
  Star,
  MapPin,
  ShieldCheck,
  Phone,
  Wrench,
  Store,
  Home,
  ShieldAlert,
  Heart,
} from "lucide-react";
import { Provider } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
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
  const [isFav, setIsFav] = React.useState(false);

  React.useEffect(() => {
    setIsFav(store.getFavorites().includes(provider.id));
  }, [provider.id, store]);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const toggled = store.toggleFavorite(provider.id);
    setIsFav(toggled);
  };

  const isVerified = provider.verificationStatus === "APPROVED";
  const hasRoadside = provider.serviceModes.includes("ROADSIDE_ASSISTANCE") && provider.isRoadsideActive;

  return (
    <div className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div className="p-5 space-y-4">
        {/* Header: Name, Verified Badge, Favorite */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-brand-600 dark:text-cyan-400 uppercase tracking-wider">
                {provider.category}
              </span>

              {isVerified && (
                <span
                  title="Verified Identity & Business Contact"
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800"
                >
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </span>
              )}

              {hasRoadside && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-[10px] font-semibold border border-red-200 dark:border-red-800 animate-pulse">
                  <ShieldAlert className="h-3 w-3" />
                  Roadside Ready
                </span>
              )}
            </div>

            <Link href={`/repairers/${provider.slug}`}>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                {provider.businessName}
              </h3>
            </Link>
          </div>

          {showFavoriteButton && (
            <button
              onClick={handleFavoriteToggle}
              aria-label={isFav ? "Remove from favorites" : "Save to favorites"}
              className={cn(
                "p-2 rounded-xl transition-colors cursor-pointer",
                isFav
                  ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
                  : "bg-slate-50 text-slate-400 hover:text-slate-600 dark:bg-slate-800 dark:text-slate-500"
              )}
            >
              <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
            </button>
          )}
        </div>

        {/* Location & Rating */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="line-clamp-1">
              {provider.barangay}, {provider.municipality}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {provider.reviewCount > 0 ? (
              <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-semibold">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{provider.averageRating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">
                  ({provider.reviewCount} genuine review{provider.reviewCount === 1 ? "" : "s"})
                </span>
              </div>
            ) : (
              <span className="text-slate-400 italic">No reviews yet</span>
            )}
          </div>
        </div>

        {/* Specialties / Services tags */}
        <div className="flex flex-wrap gap-1 pt-1">
          {provider.specialties.slice(0, 3).map((spec) => (
            <span
              key={spec}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Operational Modes Indicators */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          {provider.serviceModes.includes("SHOP_VISIT") && (
            <span className="inline-flex items-center gap-1">
              <Store className="h-3 w-3 text-slate-400" /> Shop Visit
            </span>
          )}
          {provider.serviceModes.includes("HOME_SERVICE") && (
            <span className="inline-flex items-center gap-1">
              <Home className="h-3 w-3 text-slate-400" /> Home Service
            </span>
          )}
          {provider.serviceModes.includes("ROADSIDE_ASSISTANCE") && (
            <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
              <ShieldAlert className="h-3 w-3" /> Roadside
            </span>
          )}
        </div>
      </div>

      {/* Footer: Price & Actions */}
      <div className="p-4 bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-medium">
            Service Rate
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {provider.minServicePricePhp > 0
              ? `From ${formatCurrency(provider.minServicePricePhp)}`
              : "Quote on Request"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Link href={`/repairers/${provider.slug}`}>
            <Button variant="outline" size="sm" className="text-xs h-9 px-3">
              View Profile
            </Button>
          </Link>

          {onBookClick ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onBookClick(provider)}
              className="text-xs h-9 px-3"
            >
              Request Quote
            </Button>
          ) : (
            <Link href={`/repairers/${provider.slug}#quote`}>
              <Button variant="primary" size="sm" className="text-xs h-9 px-3">
                Request Quote
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
