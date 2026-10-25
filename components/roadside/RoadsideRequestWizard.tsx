"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Disc,
  Zap,
  Bike,
  Car,
  Truck,
  MapPin,
  PhoneCall,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SAN_JOSE_BARANGAYS } from "@/data/seed_data";
import { DataStore } from "@/lib/store";
import { RoadsideRequest, DispatchStatus } from "@/types";
import { formatDateTime, getDispatchStatusLabel } from "@/lib/utils";

export function RoadsideRequestWizard() {
  const store = DataStore.getInstance();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [vehicleType, setVehicleType] = useState<RoadsideRequest["vehicleType"]>("Motorcycle");
  const [vehicleModel, setVehicleModel] = useState("");
  const [issueCategory, setIssueCategory] = useState<RoadsideRequest["issueCategory"]>(
    "Flat Tire / Vulcanizing"
  );
  const [description, setDescription] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [barangay, setBarangay] = useState("Barangay 1 (Poblacion)");
  const [activeRequest, setActiveRequest] = useState<RoadsideRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vehicleOptions = [
    { type: "Motorcycle", icon: Bike, label: "Motorcycle / Scooter" },
    { type: "Car", icon: Car, label: "Sedan / Hatchback" },
    { type: "Tricycle", icon: Bike, label: "Tricycle" },
    { type: "Van / Pickup", icon: Truck, label: "Van / SUV / Pickup" },
    { type: "Truck", icon: Truck, label: "Truck / Commercial" },
  ];

  const issueOptions = [
    { issue: "Flat Tire / Vulcanizing", icon: Disc, label: "Flat Tire / Puncture" },
    { issue: "Dead Battery / Jump-start", icon: Zap, label: "Dead Battery / Jump-Start" },
    { issue: "Mechanical Breakdown", icon: AlertTriangle, label: "Engine Stall / Won't Start" },
    { issue: "Towing / Recovery", icon: Truck, label: "Towing / Vehicle Recovery" },
  ];

  const handleStartRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !description) {
      alert("Please provide your name, phone number, and a brief description of the breakdown.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Find nearby matching roadside providers
      const matchingProviders = store.matchRoadsideProviders(10.7441, 121.9402, 30);
      const topMatch = matchingProviders[0]?.provider;

      const created = store.createRoadsideRequest({
        customerId: "cust-demo",
        customerName,
        customerPhone,
        vehicleType,
        vehicleModel,
        issueCategory,
        description,
        pickupAddress: pickupAddress || "Town Center, San Jose de Buenavista",
        barangay,
        municipality: "San Jose de Buenavista",
        coordinates: { lat: 10.7441, lng: 121.9402 },
        assignedProviderId: topMatch?.id,
        assignedProviderName: topMatch?.businessName,
        assignedProviderPhone: topMatch?.contactPhone,
        etaMinutes: topMatch ? 20 : undefined,
      });

      setActiveRequest(created);
      setStep(4); // Advance to live tracking

      // Automatically simulate realistic provider dispatch progression after 3 seconds
      if (topMatch) {
        setTimeout(() => {
          const updated = store.updateRoadsideStatus(created.id, "PROVIDER_ACCEPTED", {
            etaMinutes: 18,
          });
          if (updated) setActiveRequest(updated);
        }, 3000);

        setTimeout(() => {
          const updated = store.updateRoadsideStatus(created.id, "PROVIDER_EN_ROUTE", {
            etaMinutes: 12,
          });
          if (updated) setActiveRequest(updated);
        }, 8000);
      }
    } catch (err) {
      alert("Unable to dispatch request. Please check network connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRequest = () => {
    if (!activeRequest) return;
    const updated = store.updateRoadsideStatus(activeRequest.id, "CANCELLED");
    if (updated) setActiveRequest(updated);
  };

  return (
    <div className="max-w-2xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* Official Emergency Alert Warning Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-4 flex items-start gap-3 text-xs">
        <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-1">
          <p className="font-bold text-sm">Official Emergency Notice (Dial 911)</p>
          <p className="text-red-100 leading-tight">
            For accidents involving injuries, fire, smoke, or immediate physical danger,
            immediately call national emergency{" "}
            <a href="tel:911" className="underline font-bold text-white">
              911
            </a>{" "}
            or Antique PNP (
            <a href="tel:09985986236" className="underline text-white">
              0998 598 6236
            </a>
            ). We Got You coordinates commercial roadside repair and vulcanizing technicians.
          </p>
        </div>
      </div>

      {step === 4 && activeRequest ? (
        /* Step 4: Active Dispatch Live Tracker */
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                getDispatchStatusLabel(activeRequest.dispatchStatus).color
              }`}
            >
              {getDispatchStatusLabel(activeRequest.dispatchStatus).label}
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {activeRequest.dispatchStatus === "LOOKING_FOR_PROVIDER"
                ? "Locating Available Roadside Technician..."
                : activeRequest.dispatchStatus === "PROVIDER_EN_ROUTE"
                ? "Technician Is En Route to You!"
                : activeRequest.dispatchStatus === "ARRIVED"
                ? "Technician Has Arrived at Location"
                : "Roadside Rescue Confirmed"}
            </h3>

            <p className="text-xs text-slate-500">
              Request ID: {activeRequest.id} • Registered {formatDateTime(activeRequest.createdAt)}
            </p>
          </div>

          {/* Assigned Technician Card */}
          {activeRequest.assignedProviderName ? (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white font-bold text-lg">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {activeRequest.assignedProviderName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Dispatched from San Jose Workshop
                    </p>
                  </div>
                </div>

                {activeRequest.etaMinutes && (
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">
                      Estimated ETA
                    </span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      ~{activeRequest.etaMinutes} mins
                    </span>
                  </div>
                )}
              </div>

              {activeRequest.assignedProviderPhone && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Contact Technician Directly:
                  </span>
                  <a
                    href={`tel:${activeRequest.assignedProviderPhone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>{activeRequest.assignedProviderPhone}</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 space-y-2">
              <p className="font-semibold">Searching our Antique network for on-call vulcanizers and mechanics...</p>
              <p>We are notifying eligible shops near {activeRequest.barangay}. Please keep your phone line open.</p>
            </div>
          )}

          {/* Breakdown Location & Issue Summary */}
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Vehicle:</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {activeRequest.vehicleType} {activeRequest.vehicleModel && `(${activeRequest.vehicleModel})`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Issue Reported:</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {activeRequest.issueCategory}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Breakdown Location:</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {activeRequest.pickupAddress}, {activeRequest.barangay}
              </span>
            </div>
          </div>

          {/* Safety Checklist while waiting */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-bold text-slate-900 dark:text-white block">
              While waiting for rescue:
            </span>
            <ul className="list-disc pl-4 space-y-1">
              <li>Turn on your vehicle hazard warning lights.</li>
              <li>Stay on the shoulder away from fast highway traffic.</li>
              <li>If dark, keep your phone flashlight accessible.</li>
            </ul>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleCancelRequest}
              className="text-xs text-red-600 hover:underline font-medium cursor-pointer"
            >
              Cancel Assistance Request
            </button>
            <Button variant="outline" size="sm" onClick={() => setStep(1)}>
              Submit Another Request
            </Button>
          </div>
        </div>
      ) : (
        /* Steps 1-3 Form */
        <form onSubmit={handleStartRequest} className="p-6 sm:p-8 space-y-6 text-xs">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                Step {step} of 3
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {step === 1 && "Select Vehicle & Breakdown Issue"}
                {step === 2 && "Pin Breakdown Location in Antique"}
                {step === 3 && "Contact Details & Confirmation"}
              </h3>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    step >= s ? "bg-red-600" : "bg-slate-200 dark:bg-slate-800"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* STEP 1: Vehicle & Issue */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  What vehicle needs rescue?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {vehicleOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => setVehicleType(opt.type as any)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                          vehicleType === opt.type
                            ? "border-red-600 bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 font-bold"
                            : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-[11px] text-center">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Vehicle Model (Optional)
                </label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="e.g. Yamaha Aerox 155; Toyota Innova 2018"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  What is the emergency issue?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {issueOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.issue}
                        type="button"
                        onClick={() => setIssueCategory(opt.issue as any)}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-colors ${
                          issueCategory === opt.issue
                            ? "border-red-600 bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 font-bold"
                            : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="text-xs">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="button" variant="primary" onClick={() => setStep(2)}>
                  Next: Breakdown Location &rarr;
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Municipality
                </label>
                <input
                  type="text"
                  disabled
                  value="San Jose de Buenavista, Antique"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Barangay (Select nearest area) *
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
                  Exact Landmark / Road Marker *
                </label>
                <input
                  type="text"
                  required
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="e.g. In front of Robinsons Antique; Near Bagumbayan Bridge"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="button" variant="primary" onClick={() => setStep(3)}>
                  Next: Contact & Confirm &rarr;
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Contact & Submit */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Maria Santos"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Active Phone Number (Technician will call this) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0917 123 4567"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Brief Situation Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Rear tubeless tire ran over a nail; completely flat. Need vulcanizing or plug."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">Summary:</div>
                <div>Issue: {issueCategory} ({vehicleType})</div>
                <div>Location: {pickupAddress || "Town Center"}, {barangay}</div>
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  size="lg"
                  isLoading={isSubmitting}
                  className="font-bold shadow-lg shadow-red-600/20"
                >
                  Confirm & Dispatch Technician
                </Button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
