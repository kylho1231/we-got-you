import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { BookingStatus, DispatchStatus, VerificationStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Manila",
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Calculates straight-line distance in kilometers using the Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function getBookingStatusLabel(status: BookingStatus): {
  label: string;
  color: string;
} {
  switch (status) {
    case "SUBMITTED":
    case "AWAITING_PROVIDER":
      return { label: "Awaiting Provider", color: "bg-blue-100 text-blue-800 border-blue-200" };
    case "PROVIDER_ACCEPTED":
      return { label: "Provider Accepted", color: "bg-indigo-100 text-indigo-800 border-indigo-200" };
    case "AWAITING_QUOTE":
      return { label: "Preparing Quote", color: "bg-amber-100 text-amber-800 border-amber-200" };
    case "QUOTE_SENT":
      return { label: "Quote Ready for Review", color: "bg-purple-100 text-purple-800 border-purple-200" };
    case "QUOTE_ACCEPTED":
    case "SCHEDULED":
      return { label: "Confirmed / Scheduled", color: "bg-teal-100 text-teal-800 border-teal-200" };
    case "IN_PROGRESS":
      return { label: "Work In Progress", color: "bg-blue-100 text-blue-900 border-blue-300" };
    case "PROVIDER_MARKED_COMPLETE":
      return { label: "Pending Confirmation", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    case "COMPLETED":
      return { label: "Completed", color: "bg-green-100 text-green-800 border-green-200" };
    case "CANCELLED":
    case "DECLINED":
      return { label: "Cancelled", color: "bg-gray-100 text-gray-700 border-gray-200" };
    case "DISPUTED":
      return { label: "Under Dispute", color: "bg-rose-100 text-rose-800 border-rose-200" };
    default:
      return { label: status, color: "bg-gray-100 text-gray-700 border-gray-200" };
  }
}

export function getDispatchStatusLabel(status: DispatchStatus): {
  label: string;
  color: string;
} {
  switch (status) {
    case "LOOKING_FOR_PROVIDER":
      return { label: "Matching Provider...", color: "bg-amber-500 text-white animate-pulse" };
    case "OFFER_SENT":
      return { label: "Dispatch Alert Sent", color: "bg-amber-100 text-amber-800" };
    case "PROVIDER_ACCEPTED":
    case "ETA_PROVIDED":
      return { label: "Technician Confirmed", color: "bg-blue-600 text-white" };
    case "PROVIDER_EN_ROUTE":
      return { label: "Technician En Route", color: "bg-indigo-600 text-white" };
    case "ARRIVED":
      return { label: "Technician Arrived", color: "bg-cyan-600 text-white" };
    case "ASSISTANCE_IN_PROGRESS":
      return { label: "Assistance in Progress", color: "bg-purple-600 text-white" };
    case "COMPLETED":
      return { label: "Rescue Completed", color: "bg-green-600 text-white" };
    case "UNFULFILLED":
      return { label: "No Dispatcher Available", color: "bg-rose-600 text-white" };
    case "CANCELLED":
      return { label: "Cancelled", color: "bg-gray-500 text-white" };
    default:
      return { label: status, color: "bg-gray-500 text-white" };
  }
}

export function getVerificationStatusLabel(status: VerificationStatus): {
  label: string;
  badgeClass: string;
} {
  switch (status) {
    case "APPROVED":
      return { label: "Verified Partner", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case "PENDING_VERIFICATION":
      return { label: "Pending Review", badgeClass: "bg-amber-50 text-amber-700 border-amber-200" };
    case "NEEDS_ADDITIONAL_INFO":
      return { label: "Action Needed", badgeClass: "bg-orange-50 text-orange-700 border-orange-200" };
    case "UNCLAIMED_LISTING":
      return { label: "Unclaimed Listing", badgeClass: "bg-slate-100 text-slate-600 border-slate-200" };
    case "REJECTED":
      return { label: "Rejected", badgeClass: "bg-rose-50 text-rose-700 border-rose-200" };
    case "SUSPENDED":
      return { label: "Suspended", badgeClass: "bg-red-50 text-red-800 border-red-300" };
    default:
      return { label: status, badgeClass: "bg-gray-100 text-gray-700 border-gray-200" };
  }
}
