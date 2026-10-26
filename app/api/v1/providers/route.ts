import { NextRequest } from "next/server";
import { DataStore } from "@/lib/store";
import { ProviderQuerySchema } from "@/lib/validations/api-schemas";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryObj = Object.fromEntries(searchParams.entries());

    const parseResult = ProviderQuerySchema.safeParse(queryObj);
    if (!parseResult.success) {
      const details = parseResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return errorResponse("VALIDATION_ERROR", "Invalid query parameters", 400, details);
    }

    const { page, limit, category, barangay, serviceMode, verifiedOnly, q } = parseResult.data;

    const store = DataStore.getInstance();
    let providers = store.getProviders().filter((p) => p.isPublished);

    if (q && q.trim()) {
      const queryLower = q.toLowerCase().trim();
      providers = providers.filter((p) => {
        const nameMatch = p.businessName.toLowerCase().includes(queryLower);
        const catMatch = p.category.toLowerCase().includes(queryLower);
        const descMatch = p.description.toLowerCase().includes(queryLower);
        const specMatch = p.specialties.some((s) => s.toLowerCase().includes(queryLower));
        const srvMatch = p.services.some((s) => s.title.toLowerCase().includes(queryLower));
        return nameMatch || catMatch || descMatch || specMatch || srvMatch;
      });
    }

    if (category && category !== "ALL") {
      providers = providers.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (barangay && barangay !== "ALL") {
      providers = providers.filter((p) => p.barangay.toLowerCase() === barangay.toLowerCase());
    }

    if (serviceMode) {
      providers = providers.filter((p) => p.serviceModes.includes(serviceMode));
    }

    if (verifiedOnly) {
      providers = providers.filter((p) => p.verificationStatus === "APPROVED");
    }

    const total = providers.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedProviders = providers.slice(startIndex, startIndex + limit);

    return successResponse(paginatedProviders, {
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error: any) {
    console.error("API GET /api/v1/providers error:", error);
    return errorResponse("INTERNAL_SERVER_ERROR", "Failed to retrieve providers", 500);
  }
}
