"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Store,
  ShieldCheck,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Wrench,
  FileText,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SERVICE_CATEGORIES, SAN_JOSE_BARANGAYS } from "@/data/seed_data";
import { DataStore } from "@/lib/store";
import { ServiceMode, ProviderLead } from "@/types";
import { slugify } from "@/lib/utils";

function ProviderOnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = DataStore.getInstance();

  const claimLeadId = searchParams.get("claimLead");
  const [claimedLead, setClaimedLead] = useState<ProviderLead | null>(null);

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState<any>("REGISTERED_SHOP");
  const [category, setCategory] = useState(SERVICE_CATEGORIES[0].name);
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [barangay, setBarangay] = useState("Barangay 1 (Poblacion)");
  const [specialtiesText, setSpecialtiesText] = useState("");
  const [minPrice, setMinPrice] = useState(250);
  const [calloutFee, setCalloutFee] = useState(150);
  const [serviceModes, setServiceModes] = useState<ServiceMode[]>(["SHOP_VISIT"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (claimLeadId) {
      const lead = store.getLeads().find((l) => l.id === claimLeadId);
      if (lead) {
        setClaimedLead(lead);
        setBusinessName(lead.name);
        setCategory(lead.category);
        if (lead.phone) setContactPhone(lead.phone.split(";")[0].trim());
        setStreetAddress(lead.location);
        if (lead.barangay) setBarangay(lead.barangay);
        if (lead.services) setSpecialtiesText(lead.services);
      }
    }
  }, [claimLeadId, store]);

  const toggleMode = (mode: ServiceMode) => {
    if (serviceModes.includes(mode)) {
      if (serviceModes.length === 1) return; // Keep at least one
      setServiceModes(serviceModes.filter((m) => m !== mode));
    } else {
      setServiceModes([...serviceModes, mode]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !contactPhone || !streetAddress) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const specialties = specialtiesText
        ? specialtiesText.split(",").map((s) => s.trim())
        : ["General Repair & Servicing"];

      store.createProvider({
        slug: slugify(businessName) + `-${Date.now().toString().slice(-4)}`,
        businessName,
        businessType,
        category,
        subcategories: [category],
        description: `Local repair and service provider located at ${streetAddress}, ${barangay}, San Jose de Buenavista.`,
        contactPhone,
        contactEmail,
        streetAddress,
        barangay,
        municipality: "San Jose de Buenavista",
        coordinates: claimedLead?.coordinates || { lat: 10.7441, lng: 121.9402 },
        plusCode: claimedLead?.plusCode,
        mapPrecision: claimedLead?.mapPrecision,
        googleMapsPinUrl: claimedLead?.googleMapsPinUrl,
        sourceLeadId: claimedLead?.id,
        verificationStatus: "PENDING_VERIFICATION",
        verificationDetails: {
          hasVerifiedIdentity: true,
          hasVerifiedContact: true,
          hasVerifiedBusinessPermit: false,
          hasVerifiedCredentials: false,
          reviewerNotes: claimedLead
            ? `Claimed directory listing ${claimedLead.id} (${claimedLead.sourceType}). Pending owner verification.`
            : "Self-registered via provider onboarding. Awaiting administrative credential verification.",
        },
        serviceModes,
        specialties,
        services: [
          {
            id: `s-init-1`,
            title: "Standard Diagnosis / Service Inspection",
            description: "Initial assessment and diagnostic review",
            priceMinPhp: Number(minPrice),
            requiresDiagnostic: false,
          },
        ],
        calloutFeePhp: Number(calloutFee),
        minServicePricePhp: Number(minPrice),
        openingHours: {
          monday: "8:00 AM - 5:00 PM",
          tuesday: "8:00 AM - 5:00 PM",
          wednesday: "8:00 AM - 5:00 PM",
          thursday: "8:00 AM - 5:00 PM",
          friday: "8:00 AM - 5:00 PM",
          saturday: "8:00 AM - 3:00 PM",
          sunday: "Closed",
        },
        isPublished: true,
        isAcceptingBookings: true,
        isRoadsideActive: serviceModes.includes("ROADSIDE_ASSISTANCE"),
        galleryImages: [],
      });

      if (claimedLead) {
        store.updateLeadOutreachStatus(claimedLead.id, "Verified partner");
        const allLeads = store.getLeads();
        const targetLead = allLeads.find((l) => l.id === claimedLead.id);
        if (targetLead) {
          targetLead.isPromotedToProvider = true;
          store.saveLeads(allLeads);
        }
      }

      setIsSubmitted(true);
    } catch (err) {
      alert("Failed to register. Please check your data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight py-10 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-cyan-400 text-xs font-semibold border border-brand-200 dark:border-brand-800">
            <Store className="h-4 w-4" />
            <span>Antique Service Provider Onboarding</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Register Your Repair Business
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Connect with local customers in San Jose de Buenavista. Receive genuine service
            inquiries without advertising costs.
          </p>
        </div>

        {claimedLead && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
            <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Claiming Antique Directory Listing: </span>
              <span>{claimedLead.name} ({claimedLead.id}) • {claimedLead.location}</span>
              <p className="text-[11px] text-amber-700 dark:text-amber-300/80 mt-1">
                Your coordinates ({claimedLead.coordinates ? `${claimedLead.coordinates.lat.toFixed(4)}, ${claimedLead.coordinates.lng.toFixed(4)}` : "Storefront pin pending"}) will be linked to your provider profile upon submission.
              </p>
            </div>
          </div>
        )}

        {isSubmitted ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Application Submitted to Verification Queue
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Your business profile has been registered in the San Jose de Buenavista directory.
              An administrator will review your contact and credential details.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link href="/provider/dashboard">
                <Button variant="primary">Go to Provider Dashboard</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs"
          >
            {/* Step 1: Business Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                1. Business Identity & Type
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Business / Workshop Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. San Jose Electronics & Aircon Service"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Entity Type *
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="REGISTERED_SHOP">Registered Repair Shop / Workshop</option>
                    <option value="INDEPENDENT_TECHNICIAN">Independent Technician</option>
                    <option value="SERVICE_CENTER">Authorized Brand Service Center</option>
                    <option value="ROADSIDE_OPERATOR">Mobile Roadside / Towing Operator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Primary Service Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    {SERVICE_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Specialties (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={specialtiesText}
                    onChange={(e) => setSpecialtiesText(e.target.value)}
                    placeholder="e.g. Inverter Aircon, Freon Leak, PCB Board Repair"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Contact & Location */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                2. Location & Contact in Antique
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Active Business Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="0917 123 4567"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Contact Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="repair@myshop.ph"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Barangay (San Jose de Buenavista) *
                  </label>
                  <select
                    value={barangay}
                    onChange={(e) => setBarangay(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    {SAN_JOSE_BARANGAYS.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Street Address / Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. Salazar Street, near Plaza"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Supported Service Modes */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                3. Operational Service Modes (Select all that apply)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceModes.includes("SHOP_VISIT")}
                    onChange={() => toggleMode("SHOP_VISIT")}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <span className="font-bold block">Shop Visit</span>
                    <span className="text-[11px] text-slate-400">Customer visits shop</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceModes.includes("HOME_SERVICE")}
                    onChange={() => toggleMode("HOME_SERVICE")}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <span className="font-bold block">Home Service</span>
                    <span className="text-[11px] text-slate-400">Technician visits home</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceModes.includes("ROADSIDE_ASSISTANCE")}
                    onChange={() => toggleMode("ROADSIDE_ASSISTANCE")}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <span className="font-bold block text-red-600">Roadside Rescue</span>
                    <span className="text-[11px] text-slate-400">On-call for highway rescue</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Step 4: Verification Evidence Notice */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Verification & Anti-Fraud Compliance</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                To protect customers from fraud, our admin team audits identity, contact
                validity, and DTI or TESDA accreditation where applicable. Sensitive IDs are
                stored securely and never displayed on public listings.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
                Complete Registration
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ProviderOnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-midnight py-12 text-center text-xs text-slate-400">
          Loading onboarding portal...
        </div>
      }
    >
      <ProviderOnboardingContent />
    </Suspense>
  );
}
