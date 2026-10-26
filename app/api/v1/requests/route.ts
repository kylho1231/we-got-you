import { NextRequest } from "next/server";
import { DataStore } from "@/lib/store";
import { CreateServiceRequestSchema } from "@/lib/validations/api-schemas";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const store = DataStore.getInstance();
    const requests = store.getServiceRequests();
    return successResponse(requests, {
      total: requests.length,
      page: 1,
      limit: requests.length,
      totalPages: 1,
    });
  } catch (error: any) {
    console.error("API GET /api/v1/requests error:", error);
    return errorResponse("INTERNAL_SERVER_ERROR", "Failed to retrieve service requests", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parseResult = CreateServiceRequestSchema.safeParse(json);

    if (!parseResult.success) {
      const details = parseResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return errorResponse("VALIDATION_ERROR", "Invalid service request payload", 422, details);
    }

    const payload = parseResult.data;
    const store = DataStore.getInstance();

    let providerName = "Open Request (All Antique Providers)";
    if (payload.providerId) {
      const matched = store.getProviderById(payload.providerId);
      if (matched) {
        providerName = matched.businessName;
      }
    }

    const created = store.createServiceRequest({
      customerId: "cust-api-guest",
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      providerId: payload.providerId,
      providerName,
      category: payload.category,
      serviceMode: payload.preferredServiceMode,
      problemTitle: `${payload.category} - ${payload.problemDescription.slice(0, 40)}`,
      problemDescription: payload.problemDescription,
      streetAddress: payload.landmark || `${payload.barangay}, San Jose de Buenavista`,
      barangay: payload.barangay,
      municipality: payload.municipality || "San Jose de Buenavista",
      images: payload.photoUrls || [],
      preferredSchedule: payload.preferredDate || new Date().toISOString().split("T")[0],
    });

    return successResponse(created, undefined, 201, {
      Location: `/api/v1/requests/${created.id}`,
    });
  } catch (error: any) {
    console.error("API POST /api/v1/requests error:", error);
    return errorResponse("INTERNAL_SERVER_ERROR", "Failed to create service request", 500);
  }
}
