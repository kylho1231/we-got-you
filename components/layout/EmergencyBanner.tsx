"use client";

import React, { useState } from "react";
import { AlertTriangle, PhoneCall, X } from "lucide-react";

export function EmergencyBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <aside
      aria-label="Official Emergency Services Disclaimer"
      className="bg-slate-900 text-slate-100 border-b border-amber-500/30 text-xs py-2 px-4 transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span>
            <strong className="font-semibold text-amber-300">Life-Threatening Emergency?</strong> For
            crashes, fires, or medical crises, dial{" "}
            <a
              href="tel:911"
              className="font-bold underline text-white hover:text-amber-200 transition-colors"
            >
              911
            </a>{" "}
            or PNP Antique (
            <a
              href="tel:09985986236"
              className="underline text-slate-300 hover:text-white"
            >
              0998 598 6236
            </a>
            ). We Got You facilitates commercial repairs and roadside rescue.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="tel:911"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium text-[11px] transition-colors"
          >
            <PhoneCall className="h-3 w-3" />
            Call 911
          </a>
          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss banner"
            className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
