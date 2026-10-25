"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Wrench,
  MessageSquare,
  FileText,
  Star,
  ExternalLink,
  Heart,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { DataStore } from "@/lib/store";
import { ServiceRequest, Provider } from "@/types";
import { formatCurrency, formatDateTime, getBookingStatusLabel } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function CustomerDashboardPage() {
  const store = DataStore.getInstance();

  const [activeTab, setActiveTab] = useState<"requests" | "favorites" | "reviews">("requests");
  const [reviewModalRequest, setReviewModalRequest] = useState<ServiceRequest | null>(null);
  const [ratingOverall, setRatingOverall] = useState(5);
  const [ratingQuality, setRatingQuality] = useState(5);
  const [ratingPro, setRatingPro] = useState(5);
  const [ratingComms, setRatingComms] = useState(5);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingTime, setRatingTime] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const requests = useMemo(() => store.getServiceRequests(), [store]);
  const favoriteIds = useMemo(() => store.getFavorites(), [store]);
  const favoriteProviders = useMemo(() => {
    const all = store.getProviders();
    return all.filter((p) => favoriteIds.includes(p.id));
  }, [store, favoriteIds]);

  const handleAcceptQuote = (requestId: string) => {
    const success = store.acceptQuote(requestId);
    if (success) {
      alert("Quote accepted! The provider has been notified to proceed with scheduled service.");
      window.location.reload();
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalRequest || !reviewModalRequest.providerId) return;

    setIsSubmittingReview(true);

    try {
      store.submitReview({
        bookingId: reviewModalRequest.id,
        providerId: reviewModalRequest.providerId,
        customerId: reviewModalRequest.customerId,
        customerName: reviewModalRequest.customerName,
        overallRating: ratingOverall,
        criteria: {
          quality: ratingQuality,
          professionalism: ratingPro,
          communication: ratingComms,
          value: ratingValue,
          timeliness: ratingTime,
        },
        reviewText,
      });

      setReviewSuccess(true);
      setTimeout(() => {
        setReviewModalRequest(null);
        setReviewSuccess(false);
        setReviewText("");
        window.location.reload();
      }, 1500);
    } catch (err) {
      alert("Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight py-8 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Customer Dashboard Welcome Banner */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-600 dark:text-cyan-400 uppercase tracking-wider">
              Customer Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Service & Repair Activity
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track your service requests, approve itemized quotes, and communicate directly with technicians in Antique.
            </p>
          </div>

          <Link href="/find-repairers">
            <Button variant="primary" size="sm" className="font-semibold shadow-sm">
              + New Repair Request
            </Button>
          </Link>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "requests"
                ? "bg-brand-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Active Requests & Bookings ({requests.length})
          </button>

          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "favorites"
                ? "bg-brand-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Saved Favorites ({favoriteProviders.length})
          </button>
        </div>

        {/* TAB 1: Requests & Bookings */}
        {activeTab === "requests" && (
          <div className="space-y-4">
            {requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((req) => {
                  const statusInfo = getBookingStatusLabel(req.status);
                  const isCompleted = req.status === "COMPLETED";

                  return (
                    <div
                      key={req.id}
                      className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.color}`}
                            >
                              {statusInfo.label}
                            </span>
                            <span className="text-xs text-slate-400">
                              ID: {req.id} • {formatDateTime(req.createdAt)}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {req.problemTitle}
                          </h3>

                          <p className="text-xs text-slate-500">
                            Provider:{" "}
                            <strong className="text-slate-700 dark:text-slate-300">
                              {req.providerName || "Assigned Workshop"}
                            </strong>{" "}
                            • Mode: {req.serviceMode.replace("_", " ")}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/requests/${req.id}`}>
                            <Button variant="outline" size="sm" className="text-xs">
                              View Timeline & Details
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Problem details summary */}
                      <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        {req.problemDescription}
                      </p>

                      {/* Quote Notification Box if Quote Sent */}
                      {req.quote && req.status === "QUOTE_SENT" && (
                        <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="font-bold text-purple-900 dark:text-purple-300 block">
                              Quotation Ready for Approval:
                            </span>
                            <p className="text-purple-700 dark:text-purple-400">
                              Total Estimate:{" "}
                              <strong className="text-sm font-black">
                                {formatCurrency(req.quote.totalAmountPhp)}
                              </strong>{" "}
                              (Labor: {formatCurrency(req.quote.laborFeePhp)} • Parts:{" "}
                              {formatCurrency(req.quote.partsFeePhp)})
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleAcceptQuote(req.id)}
                              className="bg-purple-600 hover:bg-purple-700 text-xs"
                            >
                              Accept Quote Charges
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Review Button for completed service */}
                      {isCompleted && (
                        <div className="pt-2 flex justify-end">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setReviewModalRequest(req)}
                            className="gap-1 text-xs"
                          >
                            <Star className="h-3.5 w-3.5 fill-current text-amber-300" />
                            <span>Rate & Review Service</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
                <Wrench className="h-10 w-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No active requests yet
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When you submit a quote request or roadside assistance, it will appear here with live updates.
                </p>
                <div className="pt-2">
                  <Link href="/find-repairers">
                    <Button variant="primary" size="sm">
                      Browse Repairers in Antique
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Saved Favorites */}
        {activeTab === "favorites" && (
          <div className="space-y-4">
            {favoriteProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProviders.map((prov) => (
                  <div
                    key={prov.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-brand-600 uppercase">
                          {prov.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {prov.businessName}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {prov.barangay}, {prov.municipality}
                        </p>
                      </div>
                      <Link href={`/repairers/${prov.slug}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 p-8 space-y-2">
                <Heart className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold">No favorite shops saved yet.</p>
                <p className="text-xs text-slate-400">
                  Click the heart icon on any provider profile to save them for quick access.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Review Submission Modal (Section 9) */}
      {reviewModalRequest && (
        <Modal
          isOpen={Boolean(reviewModalRequest)}
          onClose={() => setReviewModalRequest(null)}
          title={`Rate & Review: ${reviewModalRequest.providerName}`}
          description="Your feedback maintains quality and trust for Antique customers."
        >
          {reviewSuccess ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Review Published!
              </h4>
              <p className="text-xs text-slate-500">
                Thank you for contributing genuine feedback.
              </p>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  Overall Star Rating (1 to 5)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingOverall(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= ratingOverall
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-sm ml-2">{ratingOverall} Stars</span>
                </div>
              </div>

              {/* Multi-criteria scores */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2 border border-slate-200 dark:border-slate-700">
                <span className="font-semibold block text-[11px] text-slate-500 uppercase">
                  Service Quality Criteria (1-5):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400">Quality of Repair</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={ratingQuality}
                      onChange={(e) => setRatingQuality(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400">Professionalism</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={ratingPro}
                      onChange={(e) => setRatingPro(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400">Communication</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={ratingComms}
                      onChange={(e) => setRatingComms(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400">Value for Money</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={ratingValue}
                      onChange={(e) => setRatingValue(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Written Feedback
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details about the fix, timeliness, and how the technician handled your item..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setReviewModalRequest(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isSubmittingReview}>
                  Submit Verified Review
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
