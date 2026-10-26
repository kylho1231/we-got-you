import { NextRequest } from "next/server";
import { DataStore } from "@/lib/store";
import { CreateRoadsideRequestSchema } from "@/lib/validations/api-schemas";
import { successResponse, errorResponse } from "@/lib/api-response";
import { calculateDistanceKm } from "@/lib/utils";

export async function GET() {
  try {
    const store = DataStore.getInstance();
    const roadsideRequests = store.getRoadsideRequests();
    return successResponse(roadsideRequests, {
      total: roadsideRequests.length,
      page: 1,
      limit: roadsideRequests.length,
      totalPages: 1,
    });
  } catch (error: any) {
    console.error("API GET /api/v1/roadside error:", error);
    return errorResponse("INTERNAL_SERVER_ERROR", "Failed to retrieve roadside requests", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parseResult = CreateRoadsideRequestSchema.safeParse(json);

    if (!parseResult.success) {
      const details = parseResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return errorResponse("VALIDATION_ERROR", "Invalid roadside emergency payload", 422, details);
    }

    const payload = parseResult.data;
    const store = DataStore.getInstance();

    // Find all roadside-ready providers
    const allProviders = store.getProviders();
    const roadsideProviders = allProviders.filter(
      (p) => p.isPublished && p.serviceModes.includes("ROADSIDE_ASSISTANCE")
    );

    // If client provided coordinates, sort by proximity
    let sortedProviders = roadsideProviders;
    if (payload.latitude && payload.longitude) {
      sortedProviders = [...roadsideProviders].sort((a, b) => {
        const distA = calculateDistanceKm(
          payload.latitude!,
          payload.longitude!,
          a.coordinates.lat,
          a.coordinates.lng
        );
        const distB = calculateDistanceKm(
          payload.latitude!,
          payload.longitude!,
          b.coordinates.lat,
          b.coordinates.lng
        );
        return distA - distB;
      });
    }

    const created = store.createRoadsideRequest({
      customerId: "cust-roadside-guest",
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      vehicleType: payload.vehicleType,
      vehicleModel: payload.vehicleModel,
      issueCategory: payload.issueCategory,
      description: payload.description,
      pickupAddress: payload.pickupAddress || `${payload.barangay}, San Jose de Buenavista`,
      barangay: payload.barangay,
      municipality: "San Jose de Buenavista",
      coordinates:
        payload.latitude && payload.longitude
          ? { lat: payload.latitude, lng: payload.longitude }
          : { lat: 10.7439, lng: 121.9366 }, // San Jose Poblacion center
    });

    return successResponse(
      {
        dispatchId: created.id,
        status: created.dispatchStatus,
        createdAt: created.createdAt,
        matchedProviders: sortedProviders.slice(0, 3).map((p) => ({
          id: p.id,
          businessName: p.businessName,
          phone: p.contactPhone,
          barangay: p.barangay,
          isRoadsideActive: p.isRoadsideActive,
          distanceKm:
            payload.latitude && payload.longitude
              ? calculateDistanceKm(
                  payload.latitude,
                  payload.longitude,
                  p.coordinates.lat,
                  p.coordinates.lng
                )
              : null,
        })),
        emergencyHotline: "San Jose Police / MDRRMO: (036) 540-8111 | Antique Provincial: 911",
      },
      undefined,
      201,
      {
        Location: `/api/v1/roadside/${created.id}`,
      }
    );
  } catch (error: any) {
    console.error("API POST /api/v1/roadside error:", error);
    return errorResponse("INTERNAL_SERVER_ERROR", "Failed to dispatch roadside assistance", 500);
  }
}
