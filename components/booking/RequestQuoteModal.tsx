"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Provider, ServiceMode } from "@/types";
import { SAN_JOSE_BARANGAYS } from "@/data/seed_data";
import { DataStore } from "@/lib/store";
import { CheckCircle2, Store, Home, Upload, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface RequestQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProvider: Provider;
}

export function RequestQuoteModal({
  isOpen,
  onClose,
  targetProvider,
}: RequestQuoteModalProps) {
  const router = useRouter();
  const store = DataStore.getInstance();

  const [serviceMode, setServiceMode] = useState<ServiceMode>(
    targetProvider.serviceModes[0] || "SHOP_VISIT"
  );
  const [problemTitle, setProblemTitle] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [barangay, setBarangay] = useState("Barangay 1 (Poblacion)");
  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemTitle || !problemDescription || !customerName || !customerPhone) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newRequest = store.createServiceRequest({
        customerId: "cust-demo",
        customerName,
        customerPhone,
        providerId: targetProvider.id,
        providerName: targetProvider.businessName,
        category: targetProvider.category,
        serviceMode,
        problemTitle,
        problemDescription,
        streetAddress: streetAddress || "San Jose de Buenavista",
        barangay,
        municipality: "San Jose de Buenavista",
        coordinates: targetProvider.coordinates,
        images: [],
        preferredSchedule: preferredSchedule || new Date().toISOString(),
      });

      setCreatedRequestId(newRequest.id);
      setIsSuccess(true);
    } catch (err) {
      alert("Failed to submit quote request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToRequest = () => {
    onClose();
    if (createdRequestId) {
      router.push(`/dashboard/requests/${createdRequestId}`);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isSuccess ? "Request Submitted" : `Request Quote: ${targetProvider.businessName}`}
      description={
        isSuccess
          ? "Your repair request has been sent to the workshop."
          : `Category: ${targetProvider.category} • San Jose de Buenavista`
      }
      maxWidth="lg"
    >
      {isSuccess ? (
        <div className="py-6 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Quote Request Sent!
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {targetProvider.businessName} will review your problem details and respond
              with an itemized quote or proposed appointment schedule.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
            <Button variant="primary" onClick={handleGoToRequest}>
              Track in Customer Dashboard
            </Button>
            <Button variant="outline" onClick={onClose}>
              Back to Browse
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Service Mode Selection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Select Service Mode:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {targetProvider.serviceModes.includes("SHOP_VISIT") && (
                <button
                  type="button"
                  onClick={() => setServiceMode("SHOP_VISIT")}
                  className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                    serviceMode === "SHOP_VISIT"
                      ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-cyan-400 font-semibold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <Store className="h-4 w-4 shrink-0" />
                  <div className="text-left">
                    <div className="text-xs">Shop Visit</div>
                    <div className="text-[10px] text-slate-400">Bring item to shop</div>
                  </div>
                </button>
              )}

              {targetProvider.serviceModes.includes("HOME_SERVICE") && (
                <button
                  type="button"
                  onClick={() => setServiceMode("HOME_SERVICE")}
                  className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                    serviceMode === "HOME_SERVICE"
                      ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-cyan-400 font-semibold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <Home className="h-4 w-4 shrink-0" />
                  <div className="text-left">
                    <div className="text-xs">Home Service</div>
                    <div className="text-[10px] text-slate-400">Technician visits you</div>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Problem Title */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Problem Summary *
            </label>
            <input
              type="text"
              required
              value={problemTitle}
              onChange={(e) => setProblemTitle(e.target.value)}
              placeholder="e.g. Inverter Refrigerator not cooling; iPhone 12 LCD black screen"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Problem Description */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Detailed Description *
            </label>
            <textarea
              required
              rows={3}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="Describe symptoms, brand/model, how long it has been happening, and any specific error lights or sounds."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Juan dela Cruz"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Contact Phone Number *
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="0917 123 4567"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Address & Barangay */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Barangay (San Jose) *
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
                Street / Landmark
              </label>
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="e.g. Near Dalipe Tradetown"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Preferred Schedule */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Preferred Date & Time</span>
            </label>
            <input
              type="datetime-local"
              value={preferredSchedule}
              onChange={(e) => setPreferredSchedule(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Submit Request
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
