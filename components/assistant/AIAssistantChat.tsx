"use client";

import React, { useState } from "react";
import { Sparkles, Send, X, AlertTriangle, ShieldCheck, Wrench, MessageSquare } from "lucide-react";
import { AIAssistant, AIResponse } from "@/lib/ai-assistant";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function AIAssistantChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<
    {
      sender: "user" | "assistant";
      text: string;
      data?: AIResponse;
    }[]
  >([
    {
      sender: "assistant",
      text: "Hello! I am your **We Got You Assistant** for Antique. Tell me what's broken or what problem you're experiencing, and I'll find the right verified local technician in San Jose de Buenavista.",
    },
  ]);

  const handleSend = async (queryToSend?: string) => {
    const query = queryToSend || inputQuery;
    if (!query.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: "user" as const, text: query }];
    setMessages(newMessages);
    setInputQuery("");
    setIsLoading(true);

    try {
      const response = await AIAssistant.analyzeProblem(query);
      setMessages([
        ...newMessages,
        {
          sender: "assistant" as const,
          text: response.message,
          data: response,
        },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          sender: "assistant" as const,
          text: "I encountered an issue scanning local records. Please check the category list directly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open We Got You AI Assistant"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-brand-600 via-blue-600 to-cyan-500 text-white font-bold text-xs shadow-xl shadow-brand-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
        >
          <Sparkles className="h-4 w-4 animate-spin-slow" />
          <span>Need Help? Ask AI</span>
        </button>
      </div>

      {/* Assistant Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          <div className="relative z-10 w-full sm:max-w-lg bg-white dark:bg-slate-900 sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-[85vh] sm:h-[620px] overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-brand-600 to-cyan-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/20">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">We Got You Assistant</h3>
                  <p className="text-[11px] text-cyan-100">
                    Real Antique Provider Matching • Low-Risk Problem Triage
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close Assistant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-brand-600 text-white rounded-br-none"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60"
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                    {/* Safety Warning Box */}
                    {msg.data?.safetyWarning && (
                      <div className="mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span className="text-[11px] font-medium leading-tight">
                          {msg.data.safetyWarning}
                        </span>
                      </div>
                    )}

                    {/* Recommended Real Providers */}
                    {msg.data?.recommendedProviders && msg.data.recommendedProviders.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                          Matching Verified Shops in San Jose:
                        </span>

                        {msg.data.recommendedProviders.map((rec) => (
                          <div
                            key={rec.provider.id}
                            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {rec.provider.businessName}
                              </span>
                              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                                <ShieldCheck className="h-3 w-3" /> Verified
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {rec.reason}
                            </p>
                            <div className="pt-2 flex items-center justify-between gap-2">
                              <a
                                href={`tel:${rec.provider.contactPhone}`}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                              >
                                Call {rec.provider.contactPhone}
                              </a>
                              <Link
                                href={`/repairers/${rec.provider.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="text-[11px] font-bold text-brand-600 dark:text-cyan-400 hover:underline"
                              >
                                View Details & Quote &rarr;
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick replies */}
                  {msg.data?.suggestedQuickReplies && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.data.suggestedQuickReplies.map((qr) => (
                        <button
                          key={qr}
                          onClick={() => handleSend(qr)}
                          className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 text-[11px] font-medium transition-colors"
                        >
                          {qr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>Analyzing problem & querying Antique provider database...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about your problem (e.g. My ref is warm, flat tire on highway)..."
                className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="shrink-0 h-9 w-9 p-0"
                disabled={!inputQuery.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
