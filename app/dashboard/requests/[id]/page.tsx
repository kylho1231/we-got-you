"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Wrench,
  FileText,
  MessageSquare,
  ShieldAlert,
  Send,
  AlertTriangle,
  Calendar,
  MapPin,
  Phone,
} from "lucide-react";
import { DataStore } from "@/lib/store";
import { formatCurrency, formatDateTime, getBookingStatusLabel } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { BookingStatus, Message } from "@/types";

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params?.id as string;
  const store = DataStore.getInstance();

  const [request, setRequest] = useState(() => store.getServiceRequestById(requestId));
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  useEffect(() => {
    const r = store.getServiceRequestById(requestId);
    setRequest(r);

    if (r && r.providerId) {
      const convo = store.getOrCreateConversation({
        requestId: r.id,
        customerId: r.customerId,
        customerName: r.customerName,
        providerId: r.providerId,
        providerName: r.providerName || "Assigned Provider",
      });
      setActiveConversationId(convo.id);
      setMessages(store.getMessages(convo.id));
    }
  }, [requestId, store]);

  if (!request) {
    return (
      <div className="min-h-screen py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Request Not Found</h2>
        <Link href="/dashboard">
          <Button variant="primary">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const statusInfo = getBookingStatusLabel(request.status);

  const handleAcceptQuote = () => {
    const ok = store.acceptQuote(request.id);
    if (ok) {
      setRequest(store.getServiceRequestById(request.id));
    }
  };

  const handleConfirmCompletion = () => {
    const ok = store.updateBookingStatus(request.id, "COMPLETED");
    if (ok) {
      setRequest(store.getServiceRequestById(request.id));
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversationId) return;

    store.sendMessage(
      activeConversationId,
      request.customerId,
      "customer",
      request.customerName,
      messageInput.trim()
    );

    setMessageInput("");
    setMessages(store.getMessages(activeConversationId));
  };

  // 15-state sequence helper
  const stateSteps: BookingStatus[] = [
    "SUBMITTED",
    "AWAITING_PROVIDER",
    "PROVIDER_ACCEPTED",
    "QUOTE_SENT",
    "QUOTE_ACCEPTED",
    "IN_PROGRESS",
    "PROVIDER_MARKED_COMPLETE",
    "COMPLETED",
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight py-8 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-brand-600 dark:text-cyan-400 font-semibold mb-2 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to My Bookings</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
                <span className="text-xs text-slate-400">Request ID: {request.id}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {request.problemTitle}
              </h1>
            </div>

            {request.status === "PROVIDER_MARKED_COMPLETE" && (
              <Button
                variant="primary"
                onClick={handleConfirmCompletion}
                className="bg-emerald-600 hover:bg-emerald-700 font-bold"
              >
                Confirm Completion & Satisfied
              </Button>
            )}
          </div>
        </div>

        {/* Visual State Machine Progress Bar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Service Lifecycle Progress
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-[10px]">
            {stateSteps.map((step, idx) => {
              const isCurrent = request.status === step;
              const isPassed = stateSteps.indexOf(request.status) >= idx;

              return (
                <div
                  key={step}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    isCurrent
                      ? "bg-brand-600 text-white font-bold border-brand-600 shadow-sm"
                      : isPassed
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800/40 dark:border-slate-800"
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider">{step.replace(/_/g, " ")}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Details & Itemized Quote */}
          <div className="lg:col-span-7 space-y-6">
            {/* Problem Details */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Request Specifications
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Service Category:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {request.category}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Service Mode:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {request.serviceMode.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Assigned Provider:</span>
                  <span className="font-semibold text-brand-600 dark:text-cyan-400">
                    {request.providerName}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Service Address:</span>
                  <span className="font-medium text-slate-900 dark:text-white text-right">
                    {request.streetAddress}, {request.barangay}, {request.municipality}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Customer Description:
                </span>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 leading-relaxed">
                  {request.problemDescription}
                </p>
              </div>
            </div>

            {/* Quotation Itemized Breakdown */}
            {request.quote && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 shadow-sm space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                      Official Quotation
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Itemized Cost Breakdown
                    </h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      request.quote.isAccepted
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {request.quote.isAccepted ? "Quote Accepted" : "Awaiting Your Acceptance"}
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Labor & Diagnostic:</span>
                    <span className="font-semibold">
                      {formatCurrency(request.quote.laborFeePhp)}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Replacement Parts & Materials:</span>
                    <span className="font-semibold">
                      {formatCurrency(request.quote.partsFeePhp)}
                    </span>
                  </div>

                  {request.quote.calloutFeePhp > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Travel / Callout Fee:</span>
                      <span className="font-semibold">
                        {formatCurrency(request.quote.calloutFeePhp)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between pt-2 text-sm font-black text-slate-900 dark:text-white">
                    <span>Total Chargeable:</span>
                    <span className="text-brand-600 dark:text-cyan-400">
                      {formatCurrency(request.quote.totalAmountPhp)}
                    </span>
                  </div>
                </div>

                {request.quote.notes && (
                  <p className="text-[11px] text-slate-500 italic">
                    Provider Note: "{request.quote.notes}"
                  </p>
                )}

                {!request.quote.isAccepted && (
                  <div className="pt-3 flex justify-end">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAcceptQuote}
                      className="bg-purple-600 hover:bg-purple-700 text-xs font-bold"
                    >
                      Accept Quote & Confirm Service
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: In-App Messaging Thread (Section 11) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[520px] overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-brand-600 dark:text-cyan-400" />
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Chat with {request.providerName}
                </h3>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">Active Thread</span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length > 0 ? (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${
                      m.senderRole === "customer" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl ${
                        m.senderRole === "customer"
                          ? "bg-brand-600 text-white rounded-br-none"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none"
                      }`}
                    >
                      <span className="text-[9px] opacity-75 block font-semibold mb-0.5">
                        {m.senderName} • {formatDateTime(m.createdAt)}
                      </span>
                      <p className="leading-relaxed">{m.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 italic">
                  No messages exchanged yet. Send a note to coordinate arrival or parts.
                </div>
              )}
            </div>

            {/* Send Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type message to technician..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
              <Button type="submit" variant="primary" size="sm" className="h-9 px-3">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
