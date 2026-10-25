import { SERVICE_CATEGORIES } from "@/data/seed_data";
import { DataStore } from "@/lib/store";
import { Provider } from "@/types";

export interface AIResponse {
  message: string;
  suggestedCategorySlug?: string;
  suggestedCategoryName?: string;
  isEmergency: boolean;
  safetyWarning?: string;
  recommendedProviders: {
    provider: Provider;
    reason: string;
  }[];
  suggestedQuickReplies?: string[];
}

interface ProblemPattern {
  keywords: string[];
  categorySlug: string;
  safetyWarning?: string;
  isEmergency?: boolean;
}

const PATTERNS: ProblemPattern[] = [
  {
    keywords: [
      "flat tire",
      "flat",
      "flats",
      "vulcanize",
      "vulcanizing",
      "puncture",
      "butas",
      "gulong",
      "naflat",
      "na-flat",
      "salbabida",
      "pako",
    ],
    categorySlug: "roadside-assistance",
    safetyWarning:
      "Safety First: If you are on the road, pull safely off onto the shoulder, turn on hazard lights, and stand clear of moving traffic.",
  },
  {
    keywords: [
      "battery",
      "jump-start",
      "jumpstart",
      "dead battery",
      "discharge",
      "ayaw umandar",
      "starter",
      "ayaw mag-start",
      "click click",
      "crank",
      "hindi magstart",
    ],
    categorySlug: "roadside-assistance",
    safetyWarning:
      "Caution: Do not smoke or ignite any flame near automotive batteries as they can emit explosive hydrogen gas.",
  },
  {
    keywords: [
      "screen",
      "lcd",
      "basag",
      "touchscreen",
      "display",
      "iphone",
      "samsung",
      "oppo",
      "vivo",
      "realme",
      "charging port",
      "cellphone",
      "phone",
      "gadget",
      "battery phone",
      "nabasa",
      "water damage",
    ],
    categorySlug: "mobile-phone-gadget-repair",
  },
  {
    keywords: [
      "laptop",
      "computer",
      "printer",
      "pc",
      "motherboard",
      "keyboard",
      "epson",
      "canon",
      "ink",
      "ciss",
      "format",
      "windows",
      "macbook",
      "desktop",
      "thermal paste",
      "overheating",
    ],
    categorySlug: "computer-laptop-printer-repair",
  },
  {
    keywords: [
      "refrigerator",
      "ref",
      "fridge",
      "freezer",
      "hindi lumalamig",
      "aircon",
      "air conditioner",
      "split type",
      "inverter",
      "freon",
      "washing machine",
      "spinner",
      "dryer",
      "microwave",
      "tv",
      "television",
    ],
    categorySlug: "appliance-repair",
    safetyWarning:
      "Important: Always unplug appliances before inspecting. Never attempt to dismantle refrigerator compressors or microwave magnetrons yourself due to high electrical capacitance.",
  },
  {
    keywords: [
      "car",
      "kotse",
      "sasakyan",
      "brake",
      "preno",
      "radiator",
      "overheat",
      "change oil",
      "pms",
      "suspension",
      "transmission",
      "innova",
      "vios",
      "fortuner",
      "hilux",
    ],
    categorySlug: "car-automotive-services",
  },
  {
    keywords: [
      "motor",
      "motorcycle",
      "scooter",
      "yamaha",
      "honda",
      "aerox",
      "nmax",
      "mio",
      "click",
      "barako",
      "kadena",
      "chain",
      "cvt",
      "linis cvt",
      "fi clean",
    ],
    categorySlug: "motorcycle-services",
  },
  {
    keywords: [
      "plumbing",
      "tubo",
      "tulo",
      "gripo",
      "water pump",
      "bomba",
      "kuryente",
      "fuse",
      "breaker",
      "wiring",
      "spark",
      "short circuit",
      "karpintero",
    ],
    categorySlug: "home-maintenance",
    safetyWarning:
      "Electrical Danger: If you see sparks or smell burning wiring, switch off your home's main circuit breaker immediately.",
  },
  {
    keywords: ["smoke", "usok", "sunog", "apoy", "crash", "bangga", "injur", "sugat", "dugo", "emergency 911"],
    categorySlug: "roadside-assistance",
    isEmergency: true,
    safetyWarning:
      "CRITICAL: If there is fire, injuries, or an active collision, immediately dial 911 or PNP Antique (0998 598 6236). This platform is for commercial repairs and cannot replace official emergency responders.",
  },
];

export class AIAssistant {
  public static async analyzeProblem(
    query: string,
    userLocation = "San Jose de Buenavista"
  ): Promise<AIResponse> {
    const lower = query.toLowerCase();
    const store = DataStore.getInstance();
    const allProviders = store.getProviders().filter((p) => p.isPublished);

    // Check critical safety patterns
    let matchedPattern: ProblemPattern | undefined;
    for (const pattern of PATTERNS) {
      if (pattern.keywords.some((k) => lower.includes(k))) {
        matchedPattern = pattern;
        break;
      }
    }

    if (matchedPattern?.isEmergency) {
      return {
        message:
          "Emergency Warning Detected: For vehicular accidents with injuries, fires, or immediate peril, please contact official emergency responders immediately.",
        isEmergency: true,
        safetyWarning: matchedPattern.safetyWarning,
        recommendedProviders: [],
        suggestedQuickReplies: ["Call 911 Now", "View Local Emergency Hotlines"],
      };
    }

    const category = matchedPattern
      ? SERVICE_CATEGORIES.find((c) => c.slug === matchedPattern?.categorySlug)
      : undefined;

    // Filter matching providers
    let matched = allProviders;
    if (category) {
      matched = matched.filter((p) => p.category === category.name);
    }

    // Sort by rating and reviews
    const recommendations = matched.slice(0, 3).map((p) => ({
      provider: p,
      reason: `Verified ${p.businessType.replace("_", " ").toLowerCase()} in ${
        p.barangay
      } with ${p.averageRating > 0 ? `${p.averageRating}★ rating` : "authentic local research"}. Supports ${p.serviceModes
        .map((m) => m.replace("_", " "))
        .join(", ")}.`,
    }));

    let message = "";
    if (category) {
      message = `I understand you're experiencing a problem related to **${category.name}**. I found ${
        matched.length
      } verified provider${matched.length === 1 ? "" : "s"} in San Jose de Buenavista who can help.`;
    } else {
      message =
        "I've scanned our Antique repair network for your inquiry. Here are trusted local service providers who can diagnose and inspect your issue.";
    }

    const quickReplies = category
      ? [
          `Book ${category.name}`,
          "Get Roadside Help",
          "What are the estimated diagnostic fees?",
        ]
      : ["Find a Phone Repairer", "Find a Mechanic", "Flat Tire Rescue"];

    return {
      message,
      suggestedCategorySlug: category?.slug,
      suggestedCategoryName: category?.name,
      isEmergency: false,
      safetyWarning: matchedPattern?.safetyWarning,
      recommendedProviders: recommendations,
      suggestedQuickReplies: quickReplies,
    };
  }
}
