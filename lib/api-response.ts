import { NextResponse } from "next/server";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiFieldError {
  field: string;
  message: string;
  code?: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ApiFieldError[];
  };
}

/**
 * Standard Success Response (200 OK / 201 Created)
 */
export function successResponse<T>(
  data: T,
  meta?: PaginationMeta,
  status: number = 200,
  headers?: Record<string, string>
) {
  const body: ApiSuccessResponse<T> = { data };
  if (meta) {
    body.meta = meta;
  }
  return NextResponse.json(body, {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

/**
 * Standard Error Response (400, 401, 403, 404, 422, 500)
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = 400,
  details?: ApiFieldError[]
) {
  const body: ApiErrorResponse = {
    error: {
      code,
      message,
      ...(details && details.length > 0 ? { details } : {}),
    },
  };
  return NextResponse.json(body, {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
