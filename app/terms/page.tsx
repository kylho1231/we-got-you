import React from "react";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight py-12 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">
            Terms of Use
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Terms of Service
          </h1>
          <p className="text-[11px] text-slate-400">
            Applicable for San Jose de Buenavista and Antique Province
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            1. Platform Nature & Scope
          </h2>
          <p>
            We Got You operates as an electronic intermediary platform facilitating the
            discovery, quotation, and coordination of local repair, diagnostic, and roadside
            services between independent customers and third-party repair workshops or
            technicians.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            2. Transparent Quotations & Chargeable Work
          </h2>
          <p>
            Providers agree to submit honest, itemized quotations covering labor, parts, and
            callout charges before starting chargeable work. Customers hold the right to
            accept or decline quotes prior to service execution.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            3. Payments & Settlements
          </h2>
          <p>
            Unless explicitly integrated through an authorized Philippine payment gateway,
            all payments (Cash upon completion or external peer-to-peer GCash) are settled
            directly between the customer and provider. We Got You does not hold customer
            funds in escrow for standard repairs.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            4. Cancellation Policy
          </h2>
          <p>
            Customers may cancel a service request without penalty prior to technician
            dispatch or quote acceptance. If a technician has already traveled to a distant
            roadside or home location in Antique, a reasonable callout reimbursement may be
            agreed.
          </p>
        </section>
      </div>
    </div>
  );
}
