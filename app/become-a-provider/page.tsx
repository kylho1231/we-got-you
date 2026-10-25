import React from "react";
import Link from "next/link";
import {
  Store,
  ShieldCheck,
  TrendingUp,
  Users,
  CheckCircle2,
  PhoneCall,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function BecomeAProviderPage() {
  const benefits = [
    {
      icon: Users,
      title: "Direct Customer Inquiries",
      description:
        "Connect directly with Antique residents seeking repair services for appliances, phones, laptops, and vehicles.",
    },
    {
      icon: ShieldCheck,
      title: "Verified Trust Badge",
      description:
        "Stand out from fly-by-night operators with verified identity, contact, and credential badges.",
    },
    {
      icon: DollarSign,
      title: "Itemized Quote Protection",
      description:
        "Customers approve your labor and parts quote before chargeable work begins, eliminating payment disputes.",
    },
    {
      icon: TrendingUp,
      title: "Roadside Rescue Dispatch",
      description:
        "Earn extra by accepting on-call roadside vulcanizing and mechanical rescues when you toggle availability ON.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight py-12 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-cyan-400 text-xs font-semibold border border-brand-200 dark:border-brand-800">
            <Store className="h-4 w-4" />
            <span>Grow Your Repair Business in Antique</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Join the Premier Local Repair Network in Antique
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Whether you run an automotive shop along General Fullon, repair gadgets in Poblacion,
            or offer mobile roadside vulcanizing, We Got You brings real local clients right to you.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <Link href="/provider/onboarding">
              <Button variant="primary" size="lg" className="font-bold gap-2">
                <span>Start Free Registration</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Core Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-cyan-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {b.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Verification Checklist */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-6">
          <h2 className="text-xl font-bold">What You Need to Get Verified</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <span className="font-bold text-white block">1. Active Phone & Address</span>
              <p className="text-[11px] text-slate-400">
                A verifiable workshop address or service base in Antique where customers or staff can find you.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <span className="font-bold text-white block">2. Declared Specialties</span>
              <p className="text-[11px] text-slate-400">
                Honest breakdown of appliance models, gadget brands, or vehicle types you are equipped to service.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <span className="font-bold text-white block">3. Transparent Rates</span>
              <p className="text-[11px] text-slate-400">
                Clear diagnostic and labor price indications to build trust with local customers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
