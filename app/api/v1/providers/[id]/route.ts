import { NextRequest } from "next/server";
import { DataStore } from "@/lib/store";
import { successResponse, errorResponse } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const store = DataStore.getInstance();

    const provider =
      store.getProviderById(id) || store.getProviderBySlug(id);

    if (!provider) {
      return errorResponse("NOT_FOUND", `Provider with identifier "${id}" not found`, 404);
    }

    return successResponse(provider);
  } catch (error: any) {
    console.error("API GET /api/v1/providers/[id] error:", error);
    return errorResponse("INTERNAL_SERVER_ERROR", "Failed to retrieve provider details", 500);
  }
}
