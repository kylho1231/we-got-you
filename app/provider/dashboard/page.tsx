"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Store,
  ShieldAlert,
  Clock,
  CheckCircle2,
  FileText,
  DollarSign,
  Star,
  Phone,
  Send,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import { DataStore } from "@/lib/store";
import { ServiceRequest, Provider, Quote, BookingStatus } from "@/types";
import { formatCurrency, formatDateTime, getBookingStatusLabel } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function ProviderDashboardPage() {
  const store = DataStore.getInstance();

  // Pick first provider as active provider profile for demonstration & testing
  const providers = useMemo(() => store.getProviders(), [store]);
  const [activeProviderId, setActiveProviderId] = useState<string>(
    providers[0]?.id || "prov-01"
  );

  const currentProvider = useMemo(() => {
    return providers.find((p) => p.id === activeProviderId) || providers[0];
  }, [providers, activeProviderId]);

  const allRequests = useMemo(() => store.getServiceRequests(), [store]);
  const providerRequests = useMemo(() => {
    return allRequests.filter(
      (r) => !r.providerId || r.providerId === currentProvider?.id
    );
  }, [allRequests, currentProvider]);

  const roadsideRequests = useMemo(() => store.getRoadsideRequests(), [store]);

  // Quote Builder State
  const [quoteRequest, setQuoteRequest] = useState<ServiceRequest | null>(null);
  const [laborFee, setLaborFee] = useState<number>(350);
  const [partsFee, setPartsFee] = useState<number>(500);
  const [calloutFee, setCalloutFee] = useState<number>(0);
  const [quoteNotes, setQuoteNotes] = useState("");
  const [isSendingQuote, setIsSendingQuote] = useState(false);

  // Toggle Roadside Active
  const handleToggleRoadside = () => {
    if (!currentProvider) return;
    const newStatus = !currentProvider.isRoadsideActive;
    store.updateProvider(currentProvider.id, { isRoadsideActive: newStatus });
    window.location.reload();
  };

  // Status updates
  const handleUpdateStatus = (requestId: string, newStatus: BookingStatus) => {
    store.updateBookingStatus(requestId, newStatus);
    window.location.reload();
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteRequest || !currentProvider) return;

    setIsSendingQuote(true);
    const total = Number(laborFee) + Number(partsFee) + Number(calloutFee);

    try {
      store.submitQuote(quoteRequest.id, {
        providerId: currentProvider.id,
        providerName: currentProvider.businessName,
        laborFeePhp: Number(laborFee),
        partsFeePhp: Number(partsFee),
        calloutFeePhp: Number(calloutFee),
        totalAmountPhp: total,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: quoteNotes,
        lineItems: [
          {
            id: "li-1",
            description: "Labor & Diagnostic Inspection",
            quantity: 1,
            unitPricePhp: Number(laborFee),
            totalPricePhp: Number(laborFee),
          },
          {
            id: "li-2",
            description: "Parts / Materials Estimate",
            quantity: 1,
            unitPricePhp: Number(partsFee),
            totalPricePhp: Number(partsFee),
          },
        ],
      });

      setQuoteRequest(null);
      window.location.reload();
    } catch (err) {
      alert("Failed to submit quote.");
    } finally {
      setIsSendingQuote(false);
    }
  };

  if (!currentProvider) {
    return <div className="p-8">Loading provider dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight py-8 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header & Switcher */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Technician & Workshop Portal
              </span>

              {/* Quick switch between simulated shops */}
              <select
                value={activeProviderId}
                onChange={(e) => setActiveProviderId(e.target.value)}
                className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
              >
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    Simulate: {p.businessName}
                  </option>
                ))}
              </select>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {currentProvider.businessName}
            </h1>
            <p className="text-xs text-slate-500">
              {currentProvider.streetAddress}, {currentProvider.barangay} • Phone: {currentProvider.contactPhone}
            </p>
          </div>

          {/* Operational Roadside & Booking Controls */}
          <div className="flex items-center gap-3">
            {currentProvider.serviceModes.includes("ROADSIDE_ASSISTANCE") && (
              <button
                onClick={handleToggleRoadside}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  currentProvider.isRoadsideActive
                    ? "bg-red-600 text-white border-red-600 shadow-md animate-pulse"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                }`}
              >
                <ShieldAlert className="h-4 w-4" />
                <span>
                  Roadside Rescue: {currentProvider.isRoadsideActive ? "ACTIVE (ON)" : "PAUSED (OFF)"}
                </span>
              </button>
            )}

            <Link href="/provider/onboarding">
              <Button variant="outline" size="sm" className="text-xs">
                Edit Services & Rates
              </Button>
            </Link>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs text-slate-500">Incoming Requests</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {providerRequests.length}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs text-slate-500">Roadside Dispatches</span>
            <div className="text-2xl font-black text-red-600 dark:text-red-400">
              {roadsideRequests.length}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs text-slate-500">Average Rating</span>
            <div className="text-2xl font-black text-amber-500 flex items-center gap-1">
              <Star className="h-5 w-5 fill-current" />
              <span>{currentProvider.averageRating.toFixed(1)}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs text-slate-500">Total Customer Reviews</span>
            <div className="text-2xl font-black text-brand-600 dark:text-cyan-400">
              {currentProvider.reviewCount}
            </div>
          </div>
        </div>

        {/* Requests Management Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Assigned Repair Requests & Bookings
            </h2>
          </div>

          {providerRequests.length > 0 ? (
            <div className="space-y-4">
              {providerRequests.map((req) => {
                const statusInfo = getBookingStatusLabel(req.status);

                return (
                  <div
                    key={req.id}
                    className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </span>
                          <span className="text-xs text-slate-400">
                            {formatDateTime(req.createdAt)}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {req.problemTitle}
                        </h3>

                        <p className="text-xs text-slate-500">
                          Customer: <strong className="text-slate-800 dark:text-slate-200">{req.customerName}</strong> • Phone:{" "}
                          <a href={`tel:${req.customerPhone}`} className="text-brand-600 underline">
                            {req.customerPhone}
                          </a>
                        </p>
                      </div>

                      {/* State Machine Transition Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {req.status === "SUBMITTED" && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleUpdateStatus(req.id, "PROVIDER_ACCEPTED")}
                            className="text-xs"
                          >
                            Accept Request
                          </Button>
                        )}

                        {(req.status === "PROVIDER_ACCEPTED" || req.status === "SUBMITTED") && !req.quote && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setQuoteRequest(req)}
                            className="text-xs bg-purple-600 hover:bg-purple-700"
                          >
                            Send Quotation
                          </Button>
                        )}

                        {req.status === "QUOTE_ACCEPTED" && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleUpdateStatus(req.id, "IN_PROGRESS")}
                            className="text-xs bg-blue-600 hover:bg-blue-700"
                          >
                            Mark In Progress
                          </Button>
                        )}

                        {req.status === "IN_PROGRESS" && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleUpdateStatus(req.id, "PROVIDER_MARKED_COMPLETE")}
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 font-bold"
                          >
                            Mark Work Complete
                          </Button>
                        )}

                        <Link href={`/dashboard/requests/${req.id}`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            Chat / View
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
                        Problem Description:
                      </span>
                      {req.problemDescription}
                    </div>

                    {req.quote && (
                      <div className="text-xs p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300 flex justify-between items-center">
                        <div>
                          <span>Quoted Total: </span>
                          <strong className="text-sm font-black">
                            {formatCurrency(req.quote.totalAmountPhp)}
                          </strong>
                          <span className="text-[11px] text-purple-600 dark:text-purple-400 ml-2">
                            (Labor: {formatCurrency(req.quote.laborFeePhp)}, Parts: {formatCurrency(req.quote.partsFeePhp)})
                          </span>
                        </div>
                        <span className="text-[11px] font-bold">
                          {req.quote.isAccepted ? "✓ Customer Accepted" : "Pending Customer Approval"}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 p-8 space-y-2">
              <p className="text-sm font-semibold">No service requests assigned right now.</p>
              <p className="text-xs text-slate-400">
                New customer bookings in San Jose will appear here automatically.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quote Builder Modal */}
      {quoteRequest && (
        <Modal
          isOpen={Boolean(quoteRequest)}
          onClose={() => setQuoteRequest(null)}
          title={`Prepare Quote: ${quoteRequest.problemTitle}`}
          description={`Customer: ${quoteRequest.customerName} • Mode: ${quoteRequest.serviceMode}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSendQuote} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Labor & Diagnostic (PHP ₱) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={laborFee}
                  onChange={(e) => setLaborFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Parts & Materials (PHP ₱)
                </label>
                <input
                  type="number"
                  min={0}
                  value={partsFee}
                  onChange={(e) => setPartsFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Callout / Travel (PHP ₱)
                </label>
                <input
                  type="number"
                  min={0}
                  value={calloutFee}
                  onChange={(e) => setCalloutFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 flex justify-between items-center text-xs">
              <span className="font-semibold text-brand-900 dark:text-brand-300">
                Total Charge to Customer:
              </span>
              <span className="text-base font-black text-brand-700 dark:text-cyan-400">
                {formatCurrency(Number(laborFee) + Number(partsFee) + Number(calloutFee))}
              </span>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Quote Notes / Parts Warranty details
              </label>
              <textarea
                rows={2}
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
                placeholder="e.g. Includes replacement inverter capacitor; 30-day service warranty."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setQuoteRequest(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSendingQuote}>
                Send Official Quote to Customer
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
