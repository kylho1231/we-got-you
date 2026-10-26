import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { DataStore } from "@/lib/store";
import { TriageQuerySchema } from "@/lib/validations/api-schemas";
import { successResponse, errorResponse } from "@/lib/api-response";
import { calculateDistanceKm } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parseResult = TriageQuerySchema.safeParse(json);

    if (!parseResult.success) {
      const details = parseResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return errorResponse("VALIDATION_ERROR", "Invalid query payload", 400, details);
    }

    const { query, latitude, longitude, barangay } = parseResult.data;
    const store = DataStore.getInstance();
    const allProviders = store.getProviders().filter((p) => p.isPublished);

    // Heuristic & keyword dictionary for provincial dialects (Karay-a, Tagalog, English)
    const lowerQuery = query.toLowerCase();

    let urgency: "EMERGENCY_ROADSIDE" | "HIGH" | "MEDIUM" | "ROUTINE" = "MEDIUM";
    let matchedCategory = "General Maintenance";
    let estimatedPricePhp = "₱200 - ₱800";
    let safetyAdvice = "Provide clear photos and details to the technician for an accurate quotation.";
    let diagnosis = `We analyzed your request: "${query}".`;

    const isRoadside =
      lowerQuery.includes("flat") ||
      lowerQuery.includes("ligid") ||
      lowerQuery.includes("tire") ||
      lowerQuery.includes("vulcaniz") ||
      lowerQuery.includes("battery") ||
      lowerQuery.includes("jump-start") ||
      lowerQuery.includes("towing") ||
      lowerQuery.includes("breakdown") ||
      lowerQuery.includes("tirik") ||
      lowerQuery.includes("stuck") ||
      lowerQuery.includes("highway") ||
      lowerQuery.includes("gas");

    const isGadget =
      lowerQuery.includes("phone") ||
      lowerQuery.includes("screen") ||
      lowerQuery.includes("lcd") ||
      lowerQuery.includes("basag") ||
      lowerQuery.includes("iphone") ||
      lowerQuery.includes("android") ||
      lowerQuery.includes("samsung") ||
      lowerQuery.includes("charging") ||
      lowerQuery.includes("battery");

    const isComputer =
      lowerQuery.includes("laptop") ||
      lowerQuery.includes("computer") ||
      lowerQuery.includes("pc") ||
      lowerQuery.includes("printer") ||
      lowerQuery.includes("windows") ||
      lowerQuery.includes("bluescreen") ||
      lowerQuery.includes("format");

    const isAppliance =
      lowerQuery.includes("aircon") ||
      lowerQuery.includes("refrigerator") ||
      lowerQuery.includes("ref") ||
      lowerQuery.includes("washing") ||
      lowerQuery.includes("electric fan") ||
      lowerQuery.includes("cooling");

    const isMotorcycle =
      lowerQuery.includes("motor") ||
      lowerQuery.includes("scooter") ||
      lowerQuery.includes("kadena") ||
      lowerQuery.includes("chain") ||
      lowerQuery.includes("kambyo");

    if (isRoadside) {
      urgency = "EMERGENCY_ROADSIDE";
      matchedCategory = "Roadside Assistance";
      diagnosis = "Emergency Roadside Issue: Flat tire, battery jump-start, or vehicle stall.";
      estimatedPricePhp = "₱150 - ₱450 (Vulcanizing/Jump-start) / ₱1,500+ (Towing)";
      safetyAdvice =
        "Pull safely off the main highway or lane. Turn on hazard warning lights while waiting for the technician.";
    } else if (isGadget) {
      urgency = "HIGH";
      matchedCategory = "Mobile Phone & Gadget Repair";
      diagnosis = "Mobile / Gadget Hardware Issue (Display screen, battery, or charging port).";
      estimatedPricePhp = "₱400 - ₱2,500 depending on screen/battery model";
      safetyAdvice =
        "Back up your phone data if possible. Do not plug in a device that has water damage.";
    } else if (isComputer) {
      urgency = "MEDIUM";
      matchedCategory = "Computer, Laptop & Printer Repair";
      diagnosis = "Laptop / Computer or Printer hardware / OS fault.";
      estimatedPricePhp = "₱500 - ₱1,800 labor + parts";
      safetyAdvice =
        "Save your drive data. Bring the original power charger along with your device.";
    } else if (isAppliance) {
      urgency = "HIGH";
      matchedCategory = "Appliance Repair";
      diagnosis = "Major Home Appliance Issue (Refrigeration, aircon cooling, or motor issue).";
      estimatedPricePhp = "₱450 - ₱1,500 inspection & cleaning / plus parts";
      safetyAdvice =
        "Unplug malfunctioning appliances if there is a burning odor or electrical sparking.";
    } else if (isMotorcycle) {
      urgency = "HIGH";
      matchedCategory = "Motorcycle Services";
      diagnosis = "Motorcycle mechanical or drivetrain issue.";
      estimatedPricePhp = "₱150 - ₱600";
      safetyAdvice = "Do not ride a motorcycle with compromised brakes or flat tires.";
    }

    // Try Gemini GenAI API if GEMINI_API_KEY is configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are the AI triage assistant for "We Got You", a local repair & emergency service platform in San Jose de Buenavista, Antique, Philippines.
The user reported: "${query}".
The user may speak English, Tagalog, or Karay-a (Antique dialect).
Respond with a concise, helpful 1-sentence diagnosis and 1-sentence local safety tip. Keep it reassuring, direct, and under 50 words total.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        if (response.text) {
          diagnosis = response.text.trim();
        }
      } catch (geminiErr) {
        console.warn("Gemini Live/GenAI API call fallback to heuristic:", geminiErr);
      }
    }

    // Filter matched verified providers in San Jose
    let matchedProviders = allProviders.filter((p) => {
      if (urgency === "EMERGENCY_ROADSIDE") {
        return p.serviceModes.includes("ROADSIDE_ASSISTANCE");
      }
      return (
        p.category.toLowerCase().includes(matchedCategory.toLowerCase()) ||
        p.specialties.some((s) => s.toLowerCase().includes(lowerQuery.slice(0, 5)))
      );
    });

    if (matchedProviders.length === 0) {
      matchedProviders = allProviders.slice(0, 3);
    }

    // Sort by proximity if coordinates available
    if (latitude && longitude) {
      matchedProviders = [...matchedProviders].sort((a, b) => {
        const distA = calculateDistanceKm(
          latitude,
          longitude,
          a.coordinates.lat,
          a.coordinates.lng
        );
        const distB = calculateDistanceKm(
          latitude,
          longitude,
          b.coordinates.lat,
          b.coordinates.lng
        );
        return distA - distB;
      });
    }

    return successResponse({
      query,
      diagnosis,
      category: matchedCategory,
      urgency,
      estimatedPricePhp,
      safetyAdvice,
      matchedShops: matchedProviders.slice(0, 3).map((p) => ({
        id: p.id,
        businessName: p.businessName,
        phone: p.contactPhone,
        barangay: p.barangay,
        category: p.category,
        verificationStatus: p.verificationStatus,
        serviceModes: p.serviceModes,
        isRoadsideActive: p.isRoadsideActive,
      })),
    });
  } catch (error: any) {
    console.error("API POST /api/v1/assistant/triage error:", error);
    return errorResponse("INTERNAL_SERVER_ERROR", "Failed to triage request", 500);
  }
}
