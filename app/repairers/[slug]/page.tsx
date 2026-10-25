"use client";

import React, { useState, useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Star,
  Store,
  Home,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Flag,
  Share2,
  Heart,
  MessageSquare,
} from "lucide-react";
import { DataStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { RequestQuoteModal } from "@/components/booking/RequestQuoteModal";
import { Modal } from "@/components/ui/Modal";

export default function ProviderProfilePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const store = DataStore.getInstance();

  const provider = useMemo(() => {
    return store.getProviderBySlug(slug);
  }, [slug, store]);

  const reviews = useMemo(() => {
    if (!provider) return [];
    return store.getReviewsByProviderId(provider.id);
  }, [provider, store]);

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);

  if (!provider) {
    return (
      <div className="min-h-screen py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Provider Not Found</h2>
        <Link href="/find-repairers">
          <Button variant="primary">Back to Repairers Directory</Button>
        </Link>
      </div>
    );
  }

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason) return;
    setReportSuccess(true);
    setTimeout(() => {
      setIsReportModalOpen(false);
      setReportSuccess(false);
      setReportReason("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight pb-24">
      {/* Top Breadcrumb & Action Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Link href="/find-repairers" className="hover:underline">
              Repairers
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">
              {provider.businessName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-600 transition-colors p-1"
              title="Report incorrect listing details"
            >
              <Flag className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Report Listing</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Profile Header Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-brand-600 dark:text-cyan-400 uppercase tracking-wider">
                  {provider.category}
                </span>

                {provider.verificationStatus === "APPROVED" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified Partner
                  </span>
                )}

                {provider.serviceModes.includes("ROADSIDE_ASSISTANCE") && provider.isRoadsideActive && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-xs font-bold border border-red-200 dark:border-red-800 animate-pulse">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Active Roadside Dispatch
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {provider.businessName}
              </h1>

              <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>
                    {provider.streetAddress}, {provider.barangay}, {provider.municipality}
                  </span>
                </div>

                <div className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                  <span>{provider.averageRating > 0 ? provider.averageRating.toFixed(1) : "No rating"}</span>
                  <span className="font-normal text-slate-400">
                    ({provider.reviewCount} customer review{provider.reviewCount === 1 ? "" : "s"})
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                {provider.description}
              </p>
            </div>

            {/* Quick Actions Column */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 md:min-w-[220px]">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsQuoteModalOpen(true)}
                className="w-full font-bold shadow-md"
              >
                Request Free Quote
              </Button>

              <a
                href={`tel:${provider.contactPhone.replace(/\s+/g, "")}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
              >
                <Phone className="h-4 w-4 text-brand-600" />
                <span>Call {provider.contactPhone}</span>
              </a>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${provider.coordinates.lat},${provider.coordinates.lng}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 text-xs font-medium"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Directions on Map</span>
              </a>
            </div>
          </div>

          {/* Verification Badges Details (Section 7 trust separation) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Audited Verification Status:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`h-4 w-4 ${
                    provider.verificationDetails.hasVerifiedIdentity
                      ? "text-emerald-500"
                      : "text-slate-300"
                  }`}
                />
                <span className={provider.verificationDetails.hasVerifiedIdentity ? "font-medium" : "text-slate-400"}>
                  Identity Confirmed
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`h-4 w-4 ${
                    provider.verificationDetails.hasVerifiedContact
                      ? "text-emerald-500"
                      : "text-slate-300"
                  }`}
                />
                <span className={provider.verificationDetails.hasVerifiedContact ? "font-medium" : "text-slate-400"}>
                  Contact Verified
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`h-4 w-4 ${
                    provider.verificationDetails.hasVerifiedBusinessPermit
                      ? "text-emerald-500"
                      : "text-slate-300"
                  }`}
                />
                <span className={provider.verificationDetails.hasVerifiedBusinessPermit ? "font-medium" : "text-slate-400"}>
                  Business Registration
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`h-4 w-4 ${
                    provider.verificationDetails.hasVerifiedCredentials
                      ? "text-emerald-500"
                      : "text-slate-300"
                  }`}
                />
                <span className={provider.verificationDetails.hasVerifiedCredentials ? "font-medium" : "text-slate-400"}>
                  Technical Credentials
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs & Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Services, Pricing, Gallery */}
          <div className="lg:col-span-8 space-y-8">
            {/* Published Services & Price Rates */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Services & Price Estimates
              </h2>
              <p className="text-xs text-slate-500">
                Transparent labor and service ranges. Exact parts are itemized and approved
                before chargeable work begins.
              </p>

              <div className="space-y-3 pt-2">
                {provider.services.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                        {item.requiresDiagnostic && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200">
                            Diagnostic Needed
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                      )}
                    </div>

                    <div className="text-right sm:shrink-0">
                      <span className="text-xs font-black text-brand-600 dark:text-cyan-400">
                        {item.priceMaxPhp
                          ? `${formatCurrency(item.priceMinPhp)} - ${formatCurrency(item.priceMaxPhp)}`
                          : formatCurrency(item.priceMinPhp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Authentic Repair Work Gallery */}
            {provider.galleryImages && provider.galleryImages.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Authentic Repair Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {provider.galleryImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative h-56 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100"
                    >
                      <img
                        src={imgUrl}
                        alt={`${provider.businessName} repair work ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Reviews & Responses (Section 9) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Verified Customer Reviews
                  </h2>
                  <p className="text-xs text-slate-500">
                    Only verified completed service requests are eligible to leave reviews.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    {provider.averageRating > 0 ? provider.averageRating.toFixed(1) : "—"}
                  </span>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {rev.customerName}
                          </span>
                          <div className="text-[11px] text-slate-400">
                            {formatDate(rev.createdAt)} • Verified Service
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: rev.overallRating }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        "{rev.reviewText}"
                      </p>

                      {/* Criteria breakdown */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-500">
                        <div>Quality: {rev.criteria.quality}/5</div>
                        <div>Pro: {rev.criteria.professionalism}/5</div>
                        <div>Comms: {rev.criteria.communication}/5</div>
                        <div>Value: {rev.criteria.value}/5</div>
                        <div>Time: {rev.criteria.timeliness}/5</div>
                      </div>

                      {/* Provider Official Response */}
                      {rev.providerResponse && (
                        <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                          <span className="font-bold text-brand-600 dark:text-cyan-400 block text-[11px]">
                            Response from {provider.businessName}:
                          </span>
                          <p className="text-slate-600 dark:text-slate-300 italic">
                            "{rev.providerResponse.responseText}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-500 italic">
                  No verified customer reviews recorded yet for this shop.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Operations Info & Service Area */}
          <div className="lg:col-span-4 space-y-6">
            {/* Operational Modes Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Supported Service Modes
              </h3>

              <div className="space-y-2 text-xs">
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    provider.serviceModes.includes("SHOP_VISIT")
                      ? "bg-brand-50/50 border-brand-200 text-brand-900 dark:bg-brand-950/40 dark:text-brand-300"
                      : "opacity-40 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    <span>Shop Walk-In Visit</span>
                  </div>
                  <span className="font-bold text-[11px]">
                    {provider.serviceModes.includes("SHOP_VISIT") ? "Available" : "No"}
                  </span>
                </div>

                <div
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    provider.serviceModes.includes("HOME_SERVICE")
                      ? "bg-brand-50/50 border-brand-200 text-brand-900 dark:bg-brand-950/40 dark:text-brand-300"
                      : "opacity-40 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>Home & Office Service</span>
                  </div>
                  <span className="font-bold text-[11px]">
                    {provider.serviceModes.includes("HOME_SERVICE")
                      ? `Fee: ${formatCurrency(provider.calloutFeePhp)}`
                      : "No"}
                  </span>
                </div>

                <div
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    provider.serviceModes.includes("ROADSIDE_ASSISTANCE")
                      ? "bg-red-50 border-red-200 text-red-900 dark:bg-red-950/40 dark:text-red-300"
                      : "opacity-40 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-red-600" />
                    <span>Roadside Rescue</span>
                  </div>
                  <span className="font-bold text-[11px]">
                    {provider.serviceModes.includes("ROADSIDE_ASSISTANCE")
                      ? provider.isRoadsideActive
                        ? "Active"
                        : "Paused"
                      : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>Operating Schedule</span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Mon – Fri</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {provider.openingHours.monday || "8:00 AM - 5:00 PM"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Saturday</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {provider.openingHours.saturday || "8:00 AM - 3:00 PM"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Sunday</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {provider.openingHours.sunday || "Closed"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Request Modal */}
      {isQuoteModalOpen && (
        <RequestQuoteModal
          isOpen={isQuoteModalOpen}
          onClose={() => setIsQuoteModalOpen(false)}
          targetProvider={provider}
        />
      )}

      {/* Report Listing Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report Business Listing"
        description="Help us maintain genuine data integrity in Antique."
      >
        {reportSuccess ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
            <p className="text-xs font-bold">Report logged for administrative review.</p>
          </div>
        ) : (
          <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
            <p className="text-slate-500">
              Please specify if this workshop has closed, changed phone numbers, or if
              service information is inaccurate.
            </p>
            <textarea
              required
              rows={3}
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="e.g. Shop moved to a different barangay; contact number is no longer active..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsReportModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="danger" size="sm">
                Submit Report
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
