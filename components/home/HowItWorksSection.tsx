import React from "react";
import { Search, FileText, CheckCircle, Star } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      icon: Search,
      title: "Tell Us What's Broken",
      description:
        "Choose your category, specify whether you need shop visit, home service, or roadside help, and upload optional photos.",
    },
    {
      step: "02",
      icon: FileText,
      title: "Discover Real Antique Providers",
      description:
        "Compare genuine verified workshops and technicians in San Jose de Buenavista. See declared specialties and price ranges.",
    },
    {
      step: "03",
      icon: CheckCircle,
      title: "Review Itemized Quotes",
      description:
        "Your provider inspects the issue and issues a clear breakdown of labor and parts before any chargeable work begins.",
    },
    {
      step: "04",
      icon: Star,
      title: "Pay Agreed Rate & Rate Work",
      description:
        "Settle directly via Cash or GCash upon satisfactory completion, and submit an authentic review to help your community.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-midnight transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold text-brand-600 dark:text-cyan-400 uppercase tracking-wider">
            Simple & Transparent
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            How We Got You Works
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            No endless Facebook group searches or wandering from shop to shop. Get local help
            with total peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-brand-600/30 dark:text-cyan-500/30">
                      {item.step}
                    </span>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-brand-600 dark:text-cyan-400 shadow-sm border border-slate-200/80 dark:border-slate-700">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
