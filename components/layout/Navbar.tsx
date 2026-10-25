"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wrench,
  Search,
  MapPin,
  ShieldAlert,
  Menu,
  X,
  User,
  Store,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Find Services", href: "/services" },
    { label: "Repairers", href: "/find-repairers" },
    { label: "Live Map", href: "/map" },
    { label: "Roadside Help", href: "/roadside-assistance", isEmergency: true },
    { label: "How It Works", href: "/how-it-works" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-midnight/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Location Badge */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-1"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 to-cyan-500 text-white shadow-md shadow-brand-600/20 group-hover:scale-105 transition-transform">
                <Wrench className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                  WE GOT YOU
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                  San Jose, Antique
                </span>
              </div>
            </Link>

            {/* Quick Town Pin */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
              <MapPin className="h-3.5 w-3.5 text-brand-600 dark:text-cyan-400" />
              <span>San Jose de Buenavista</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer",
                    link.isEmergency
                      ? "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 font-semibold"
                      : isActive
                      ? "text-brand-600 bg-brand-50 dark:bg-brand-950/50 dark:text-brand-400"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
                  )}
                >
                  {link.isEmergency && (
                    <ShieldAlert className="inline h-4 w-4 mr-1 text-red-500" />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Roadside Assistance CTA */}
            <Link href="/roadside-assistance">
              <Button
                variant="danger"
                size="sm"
                className="gap-1.5 font-semibold shadow-sm animate-pulse-subtle"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>Roadside Help</span>
              </Button>
            </Link>

            {/* Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                aria-expanded={roleMenuOpen}
                aria-haspopup="true"
              >
                <User className="h-3.5 w-3.5 text-brand-600" />
                <span>Portals</span>
                <ChevronDown className="h-3 w-3 text-slate-500" />
              </button>

              {roleMenuOpen && (
                <div
                  onMouseLeave={() => setRoleMenuOpen(false)}
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-slide-up"
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Workspace
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setRoleMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <User className="h-4 w-4 text-brand-600" />
                    <div>
                      <div className="font-medium">Customer Portal</div>
                      <div className="text-xs text-slate-400">Track quotes & bookings</div>
                    </div>
                  </Link>

                  <Link
                    href="/provider/dashboard"
                    onClick={() => setRoleMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Store className="h-4 w-4 text-amber-600" />
                    <div>
                      <div className="font-medium">Provider Dashboard</div>
                      <div className="text-xs text-slate-400">Manage jobs & roadside</div>
                    </div>
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setRoleMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <div>
                      <div className="font-medium">Super Admin</div>
                      <div className="text-xs text-slate-400">Leads, verifications & metrics</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Become a Provider Button */}
            <Link href="/become-a-provider">
              <Button variant="outline" size="sm" className="hidden lg:inline-flex">
                Join as Provider
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/roadside-assistance">
              <button
                aria-label="Emergency Assistance"
                className="p-2 rounded-xl bg-red-600 text-white font-semibold text-xs flex items-center gap-1 shadow-sm"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>Rescue</span>
              </button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-midnight px-4 pt-2 pb-6 space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 mb-3">
            <MapPin className="h-3.5 w-3.5 text-brand-600" />
            <span>Serving San Jose, Sibalom & Hamtic, Antique</span>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-3 py-2.5 rounded-xl text-base font-medium transition-colors",
                link.isEmergency
                  ? "text-red-600 bg-red-50 dark:bg-red-950/30"
                  : pathname === link.href
                  ? "text-brand-600 bg-brand-50 dark:bg-brand-950/40"
                  : "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              )}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">
              Switch Portal
            </div>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <User className="h-4 w-4 text-brand-600" />
              <span>Customer Portal</span>
            </Link>
            <Link
              href="/provider/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Store className="h-4 w-4 text-amber-600" />
              <span>Provider Dashboard</span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Super Admin Portal</span>
            </Link>
            <Link
              href="/become-a-provider"
              onClick={() => setIsOpen(false)}
              className="block pt-2"
            >
              <Button variant="outline" className="w-full">
                Register as Provider
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
