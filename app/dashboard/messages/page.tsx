"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { MessageSquare, ArrowRight, User } from "lucide-react";
import { DataStore } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function MessagesPage() {
  const store = DataStore.getInstance();
  const conversations = useMemo(() => store.getConversations(), [store]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight py-8 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <span className="text-xs font-bold text-brand-600 dark:text-cyan-400 uppercase tracking-wider">
            Communication Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Messages & Coordination
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Secure in-app communication with repair technicians and roadside dispatchers in Antique.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
          {conversations.length > 0 ? (
            conversations.map((convo) => (
              <Link
                key={convo.id}
                href={
                  convo.requestId
                    ? `/dashboard/requests/${convo.requestId}`
                    : `/dashboard`
                }
                className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-cyan-400 font-bold">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {convo.providerName}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {convo.lastMessageSnippet}
                    </p>
                  </div>
                </div>

                <div className="text-right flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-slate-400">
                    {formatDateTime(convo.lastMessageAt)}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-16 p-8 space-y-3">
              <MessageSquare className="h-10 w-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No conversations active
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When you submit a service request or ask for a quote, a private thread is created here.
              </p>
              <div className="pt-2">
                <Link href="/find-repairers">
                  <Button variant="primary" size="sm">
                    Find a Repairer
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
