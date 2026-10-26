"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wrench, ShieldAlert, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Repairers", href: "/find-repairers", icon: Wrench },
    {
      label: "Roadside",
      href: "/roadside-assistance",
      icon: ShieldAlert,
      isEmergency: true,
    },
    { label: "Map", href: "/map", icon: MapPin },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-midnight/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg px-2 py-1 safe-area-pb"
    >
      <div className="grid grid-cols-4 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[11px] font-semibold transition-colors min-h-[48px]",
                item.isEmergency
                  ? isActive
                    ? "text-red-600 dark:text-red-400 font-bold"
                    : "text-red-500 hover:text-red-600 font-bold"
                  : isActive
                  ? "text-brand-600 dark:text-cyan-400 font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              )}
            >
              <div
                className={cn(
                  "p-1 rounded-lg transition-transform",
                  item.isEmergency && "animate-pulse"
                )}
              >
                <Icon className={cn("h-5 w-5", item.isEmergency && "text-red-600")} />
              </div>
              <span className="leading-tight mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
