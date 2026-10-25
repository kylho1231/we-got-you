import React from "react";
import Link from "next/link";
import { Wrench, PhoneCall, Shield, MapPin, ExternalLink } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/data/seed_data";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-14 pb-20 md:pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-white shadow-md">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">
                  WE GOT YOU
                </span>
                <p className="text-xs text-cyan-400 font-medium">
                  Local Help. Right When You Need It.
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The premier local repair, mechanic, appliance technician, and roadside
              assistance platform serving San Jose de Buenavista, Sibalom, Hamtic, and
              the rest of Antique Province, Philippines.
            </p>

            {/* Coverage badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>Initial Hub: San Jose de Buenavista, Antique 5700</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Services
            </h4>
            <ul className="space-y-2 text-xs">
              {SERVICE_CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/services/${cat.slug}`}
                    className="hover:text-cyan-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="text-cyan-400 hover:underline inline-flex items-center gap-1 font-medium"
                >
                  All 7 Service Categories &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Portals & Legal */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Platform & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/how-it-works" className="hover:text-cyan-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/become-a-provider" className="hover:text-cyan-400 transition-colors">
                  Join as a Repairer
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-cyan-400 transition-colors">
                  Trust & Safety Standards
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
                  Privacy Policy (DPA RA 10173)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-400 hover:text-white transition-colors">
                  Admin Verification Queue
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Hotlines Box */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/80 space-y-3">
            <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-xs">
              <PhoneCall className="h-4 w-4" />
              <span>Antique Emergency Numbers</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>National Emergency:</span>
                <a href="tel:911" className="font-bold text-white hover:text-rose-400">
                  911
                </a>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>PNP Antique Police:</span>
                <a href="tel:09985986236" className="text-slate-200 hover:text-white">
                  0998 598 6236
                </a>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>BFP Fire Station:</span>
                <a href="tel:09154877509" className="text-slate-200 hover:text-white">
                  0915 487 7509
                </a>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              We Got You facilitates commercial repairs. For life threats, call 911.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} We Got You Inc. San Jose de Buenavista, Antique, Philippines.</p>
          <div className="flex items-center gap-4">
            <span>Primary Currency: Philippine Peso (PHP / ₱)</span>
            <span>Timezone: Asia/Manila (PHT)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
