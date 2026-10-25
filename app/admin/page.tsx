"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Store,
  Wrench,
  ShieldAlert,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
  Search,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";
import { DataStore } from "@/lib/store";
import { ProviderLead, Provider, VerificationStatus } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function AdminControlPage() {
  const store = DataStore.getInstance();

  const [activeTab, setActiveTab] = useState<
    "leads" | "verifications" | "requests" | "geography"
  >("leads");

  // Lead State
  const [leadQuery, setLeadQuery] = useState("");
  const [selectedLeadCategory, setSelectedLeadCategory] = useState("ALL");
  const [isPromotingLeadId, setIsPromotingLeadId] = useState<string | null>(null);

  // Verification State
  const [verifyModalProvider, setVerifyModalProvider] = useState<Provider | null>(null);

  const leads = useMemo(() => store.getLeads(), [store]);
  const providers = useMemo(() => store.getProviders(), [store]);
  const serviceRequests = useMemo(() => store.getServiceRequests(), [store]);
  const roadsideRequests = useMemo(() => store.getRoadsideRequests(), [store]);

  // Operational Metrics
  const approvedProvidersCount = providers.filter((p) => p.verificationStatus === "APPROVED").length;
  const pendingVerificationsCount = providers.filter(
    (p) => p.verificationStatus === "PENDING_VERIFICATION" || p.verificationStatus === "UNCLAIMED_LISTING"
  ).length;
  const activeRoadsideCount = roadsideRequests.filter(
    (r) => r.dispatchStatus !== "COMPLETED" && r.dispatchStatus !== "CANCELLED"
  ).length;

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (leadQuery.trim()) {
        const q = leadQuery.toLowerCase();
        const matchesName = lead.name.toLowerCase().includes(q);
        const matchesLoc = lead.location.toLowerCase().includes(q);
        const matchesServices = lead.services.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc && !matchesServices) return false;
      }
      if (selectedLeadCategory !== "ALL" && lead.category !== selectedLeadCategory) {
        return false;
      }
      return true;
    });
  }, [leads, leadQuery, selectedLeadCategory]);

  const handlePromoteLead = (leadId: string) => {
    setIsPromotingLeadId(leadId);
    try {
      const createdProvider = store.promoteLeadToProvider(leadId);
      if (createdProvider) {
        alert(`Successfully promoted "${createdProvider.businessName}" to active provider!`);
        window.location.reload();
      }
    } catch {
      alert("Failed to promote lead.");
    } finally {
      setIsPromotingLeadId(null);
    }
  };

  const handleUpdateVerificationStatus = (
    providerId: string,
    status: VerificationStatus,
    notes?: string
  ) => {
    store.updateProvider(providerId, {
      verificationStatus: status,
      verificationDetails: {
        hasVerifiedIdentity: status === "APPROVED",
        hasVerifiedContact: status === "APPROVED",
        hasVerifiedBusinessPermit: status === "APPROVED",
        hasVerifiedCredentials: status === "APPROVED",
        verifiedAt: status === "APPROVED" ? new Date().toISOString() : undefined,
        reviewerNotes: notes || `Audit action: ${status}`,
      },
    });
    setVerifyModalProvider(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Super Admin Control Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              We Got You Operations & Verification
            </h1>
            <p className="text-xs text-slate-400">
              Administer Antique leads, provider approvals, and live service dispatches.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-700 px-3 py-1.5 rounded-xl text-slate-300 font-mono">
              Server: Active (Asia/Manila)
            </span>
          </div>
        </div>

        {/* Real Metrics Grid (Section 19: Only real authorized records) */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">
              Approved Providers
            </span>
            <div className="text-2xl font-black text-emerald-400">
              {approvedProvidersCount}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">
              Pending Approvals
            </span>
            <div className="text-2xl font-black text-amber-400">
              {pendingVerificationsCount}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">
              Active Bookings
            </span>
            <div className="text-2xl font-black text-brand-400">
              {serviceRequests.length}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">
              Roadside Dispatches
            </span>
            <div className="text-2xl font-black text-red-400">
              {activeRoadsideCount}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1 col-span-2 lg:col-span-1">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">
              Researched Leads
            </span>
            <div className="text-2xl font-black text-cyan-400">{leads.length}</div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
              activeTab === "leads"
                ? "bg-cyan-500 text-slate-950 border-cyan-400"
                : "bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            Antique Researched Leads ({leads.length})
          </button>

          <button
            onClick={() => setActiveTab("verifications")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
              activeTab === "verifications"
                ? "bg-cyan-500 text-slate-950 border-cyan-400"
                : "bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            Provider Verification Queue ({providers.length})
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
              activeTab === "requests"
                ? "bg-cyan-500 text-slate-950 border-cyan-400"
                : "bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            Live Requests & Dispatches ({serviceRequests.length + roadsideRequests.length})
          </button>
        </div>

        {/* TAB 1: Lead Management (Section 15) */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={leadQuery}
                    onChange={(e) => setLeadQuery(e.target.value)}
                    placeholder="Search Antique leads by name or location..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none"
                  />
                </div>

                <select
                  value={selectedLeadCategory}
                  onChange={(e) => setSelectedLeadCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs"
                >
                  <option value="ALL">All Lead Categories</option>
                  <option value="Appliance Repair">Appliance / Aircon</option>
                  <option value="Mobile Phone & Gadget Repair">Phone / Gadget</option>
                  <option value="Computer, Laptop & Printer Repair">Computer / Printer</option>
                  <option value="Car & Automotive Services">Car / Automotive</option>
                  <option value="Motorcycle Services">Motorcycle</option>
                  <option value="Roadside Assistance">Tires / Vulcanizing</option>
                </select>
              </div>

              <div className="text-slate-400 text-[11px]">
                Showing {filteredLeads.length} discovered Antique shops
              </div>
            </div>

            {/* Leads Table */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="p-3.5">Provider / Shop</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">San Jose Location</th>
                    <th className="p-3.5">Public Phone</th>
                    <th className="p-3.5">Evidence Strength</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[11px]">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-white max-w-[200px]">
                        <div>{lead.name}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1 font-normal">
                          {lead.services}
                        </div>
                      </td>
                      <td className="p-3.5 text-cyan-400 font-medium">{lead.category}</td>
                      <td className="p-3.5 text-slate-300">{lead.location}</td>
                      <td className="p-3.5 font-mono text-slate-200">
                        {lead.phone || <span className="text-slate-500 italic">None listed</span>}
                      </td>
                      <td className="p-3.5">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {lead.evidenceStrength}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {lead.isPromotedToProvider ? (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                            ✓ Active Partner
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                            {lead.outreachStatus}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        {!lead.isPromotedToProvider ? (
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={isPromotingLeadId === lead.id}
                            onClick={() => handlePromoteLead(lead.id)}
                            className="text-[10px] py-1 px-2.5 h-7 bg-brand-600 hover:bg-brand-500"
                          >
                            Promote to Provider
                          </Button>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            Live on Marketplace
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Verification Queue */}
        {activeTab === "verifications" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {providers.map((prov) => (
                <div
                  key={prov.id}
                  className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-cyan-400 uppercase">
                        {prov.category}
                      </span>
                      <h3 className="text-sm font-bold text-white">{prov.businessName}</h3>
                      <p className="text-slate-400 text-[11px]">
                        {prov.barangay}, {prov.municipality}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        prov.verificationStatus === "APPROVED"
                          ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                          : "bg-amber-950 text-amber-300 border-amber-800"
                      }`}
                    >
                      {prov.verificationStatus}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-[11px] text-slate-300">
                    <div>Contact: {prov.contactPhone}</div>
                    <div>Modes: {prov.serviceModes.join(", ")}</div>
                    <div>
                      Roadside Active:{" "}
                      <strong className={prov.isRoadsideActive ? "text-red-400" : "text-slate-500"}>
                        {prov.isRoadsideActive ? "YES" : "NO"}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setVerifyModalProvider(prov)}
                      className="text-xs h-8 text-white border-slate-600"
                    >
                      Audit / Manage Status
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Requests & Dispatch Monitor */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                Live Roadside Assistance Dispatches ({roadsideRequests.length})
              </h2>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden overflow-x-auto text-xs">
                <table className="w-full text-left text-slate-300">
                  <thead className="bg-slate-800/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="p-3.5">Incident ID</th>
                      <th className="p-3.5">Customer & Phone</th>
                      <th className="p-3.5">Issue</th>
                      <th className="p-3.5">Location</th>
                      <th className="p-3.5">Assigned Dispatcher</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-[11px]">
                    {roadsideRequests.map((r) => (
                      <tr key={r.id}>
                        <td className="p-3.5 font-mono text-cyan-400">{r.id}</td>
                        <td className="p-3.5">
                          <div className="font-bold text-white">{r.customerName}</div>
                          <div className="text-slate-400">{r.customerPhone}</div>
                        </td>
                        <td className="p-3.5 text-red-400 font-medium">{r.issueCategory}</td>
                        <td className="p-3.5 text-slate-300">
                          {r.pickupAddress}, {r.barangay}
                        </td>
                        <td className="p-3.5 text-slate-200">
                          {r.assignedProviderName || "Pending Assignment"}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold">
                            {r.dispatchStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Verification Audit Modal */}
      {verifyModalProvider && (
        <Modal
          isOpen={Boolean(verifyModalProvider)}
          onClose={() => setVerifyModalProvider(null)}
          title={`Audit Provider: ${verifyModalProvider.businessName}`}
          description={`Category: ${verifyModalProvider.category} • San Jose de Buenavista`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 space-y-1">
              <div>Phone: {verifyModalProvider.contactPhone}</div>
              <div>Address: {verifyModalProvider.streetAddress}, {verifyModalProvider.barangay}</div>
              <div>Current Status: <strong>{verifyModalProvider.verificationStatus}</strong></div>
            </div>

            <div className="space-y-2">
              <span className="font-semibold block">Administrative Actions:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  variant="primary"
                  onClick={() =>
                    handleUpdateVerificationStatus(
                      verifyModalProvider.id,
                      "APPROVED",
                      "Audited by Admin. Contact and business verification confirmed."
                    )
                  }
                  className="bg-emerald-600 hover:bg-emerald-700 text-xs"
                >
                  ✓ Approve Provider
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    handleUpdateVerificationStatus(
                      verifyModalProvider.id,
                      "NEEDS_ADDITIONAL_INFO",
                      "Requested additional proof of shop location."
                    )
                  }
                  className="text-xs"
                >
                  Request More Info
                </Button>

                <Button
                  variant="danger"
                  onClick={() =>
                    handleUpdateVerificationStatus(
                      verifyModalProvider.id,
                      "REJECTED",
                      "Unresponsive or unverified."
                    )
                  }
                  className="text-xs"
                >
                  Reject Application
                </Button>

                <Button
                  variant="secondary"
                  onClick={() =>
                    handleUpdateVerificationStatus(
                      verifyModalProvider.id,
                      "SUSPENDED",
                      "Suspended due to policy dispute."
                    )
                  }
                  className="text-xs"
                >
                  Suspend Account
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
