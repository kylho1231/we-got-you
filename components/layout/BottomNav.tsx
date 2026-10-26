"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShieldAlert, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shops", href: "/find-repairers", icon: Search },
    {
      label: "Rescue",
      href: "/roadside-assistance",
      icon: ShieldAlert,
      isEmergency: true,
    },
    { label: "Live Map", href: "/map", icon: MapPin },
    { label: "Account", href: "/dashboard", icon: User },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-midnight/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe"
    >
      <div className="grid grid-cols-5 h-16 items-center px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          if (tab.isEmergency) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center justify-center -mt-5 group"
                aria-label="Emergency Roadside Rescue"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-lg shadow-red-600/30 group-active:scale-95 transition-transform">
                  <Icon className="h-6 w-6 animate-pulse" />
                </div>
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 mt-1">
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 transition-colors group",
                isActive
                  ? "text-brand-600 dark:text-cyan-400"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 transition-transform group-active:scale-95" />
              <span className="text-[11px] font-medium mt-1">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
