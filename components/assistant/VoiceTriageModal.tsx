"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Sparkles,
  X,
  Phone,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Wrench,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface VoiceTriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

interface TriageResult {
  query: string;
  diagnosis: string;
  category: string;
  urgency: "EMERGENCY_ROADSIDE" | "HIGH" | "MEDIUM" | "ROUTINE";
  estimatedPricePhp: string;
  safetyAdvice: string;
  matchedShops: Array<{
    id: string;
    businessName: string;
    phone: string;
    barangay: string;
    category: string;
    verificationStatus: string;
    isRoadsideActive?: boolean;
  }>;
}

export function VoiceTriageModal({ isOpen, onClose, initialQuery = "" }: VoiceTriageModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleTriage(initialQuery);
    }
  }, [initialQuery]);

  // Setup Web Speech API for voice recognition if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "fil-PH"; // Philippine Filipino / English / Karay-a

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuery(transcript);
          setIsListening(false);
          handleTriage(transcript);
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
          if (event.error === "not-allowed") {
            setSpeechError("Microphone access was not granted. You can type your problem below.");
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    setSpeechError(null);
    if (!recognitionRef.current) {
      setSpeechError(
        "Voice input is not supported in this browser. Please type your problem below."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Failed to start voice recognition:", err);
        setIsListening(false);
      }
    }
  };

  const handleTriage = async (searchQuery: string) => {
    const textToSubmit = searchQuery || query;
    if (!textToSubmit.trim()) return;

    setIsLoading(true);
    setSpeechError(null);

    try {
      const response = await fetch("/api/v1/assistant/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToSubmit.trim() }),
      });

      if (!response.ok) {
        throw new Error("Triage failed");
      }

      const json = await response.json();
      if (json.data) {
        setResult(json.data);
      }
    } catch (err: any) {
      console.error("Triage error:", err);
      setSpeechError("Could not analyze request. Please try again or select a category.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-cyan-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Voice & Quick Problem Triage
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Speak or type in Karay-a, Tagalog, or English
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close triage modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Voice Microphone Hero Button */}
        <div className="text-center py-2 space-y-3">
          <button
            type="button"
            onClick={toggleListening}
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full transition-all shadow-lg cursor-pointer ${
              isListening
                ? "bg-red-600 text-white animate-pulse ring-8 ring-red-400/30"
                : "bg-brand-600 hover:bg-brand-700 text-white"
            }`}
          >
            {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
          </button>

          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {isListening
              ? "Listening... Speak your problem now (e.g. 'Flat tire sa San Pedro')"
              : "Tap the microphone to speak your problem"}
          </p>
        </div>

        {/* Text Input Fallback */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTriage(query);
          }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Or type here (e.g. flat tire, basag na screen, ayaw umandar)..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Button
              type="submit"
              disabled={isLoading || !query.trim()}
              variant="primary"
              className="shrink-0 px-5 font-bold"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
            </Button>
          </div>

          {speechError && (
            <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800">
              {speechError}
            </p>
          )}
        </form>

        {/* Triage Results Card */}
        {result && (
          <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div
              className={`p-4 rounded-2xl border ${
                result.urgency === "EMERGENCY_ROADSIDE"
                  ? "bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200"
                  : "bg-brand-50 dark:bg-slate-800/80 border-brand-200 dark:border-slate-700 text-slate-900 dark:text-white"
              }`}
            >
              <div className="flex items-start gap-3">
                {result.urgency === "EMERGENCY_ROADSIDE" ? (
                  <ShieldAlert className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                ) : (
                  <Wrench className="h-6 w-6 text-brand-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-cyan-300">
                      {result.category}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 font-bold">
                      Est: {result.estimatedPricePhp}
                    </span>
                  </div>
                  <p className="text-sm font-semibold">{result.diagnosis}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    💡 <strong>Tip:</strong> {result.safetyAdvice}
                  </p>
                </div>
              </div>
            </div>

            {/* Matched Verified Shops */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Recommended Verified Shops in San Jose:
              </h3>

              <div className="space-y-2">
                {result.matchedShops.map((shop) => (
                  <div
                    key={shop.id}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {shop.businessName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {shop.barangay}, San Jose de Buenavista
                      </p>
                    </div>

                    <a
                      href={`tel:${shop.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer shrink-0 min-h-[40px]"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Call {shop.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
