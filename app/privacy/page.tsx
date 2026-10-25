import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight py-12 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">
            Legal & Compliance
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Privacy Policy (RA 10173 Compliance)
          </h1>
          <p className="text-[11px] text-slate-400">
            Effective Date: October 2026 • Republic of the Philippines
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            1. Commitment to Data Privacy
          </h2>
          <p>
            We Got You operates in the Philippines and adheres strictly to the Data Privacy
            Act of 2012 (Republic Act No. 10173) and the regulations of the National Privacy
            Commission (NPC). We collect and process personal data with transparency,
            legitimate purpose, and proportionality.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            2. Personal Data We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Customer profile details: name, contact number, preferred barangay/municipality in Antique.</li>
            <li>Service request information: device/appliance model, repair descriptions, and attached photos.</li>
            <li>Precise location coordinates: collected only with affirmative consent for roadside or home-visit requests.</li>
            <li>Provider credentials: DTI permits, technical certifications, and business verification records.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            3. Non-Disclosure of Sensitive Records
          </h2>
          <p>
            Sensitive identification documents submitted by providers or customers are stored
            in encrypted storage and reviewed strictly by authorized administrators. Sensitive
            documents and private customer home coordinates are never published on public
            search listings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            4. User Rights & Account Deletion
          </h2>
          <p>
            As a data subject, you hold the right to access, correct, or request the deletion
            of your personal data and account records, subject to applicable Philippine legal
            and taxation retention requirements.
          </p>
        </section>
      </div>
    </div>
  );
}
