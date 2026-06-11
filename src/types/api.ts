// ─────────────────────────────────────────────────────────────────────────────
// Standard API response envelopes
// Used by the backend to send responses and by the frontend to type HTTP calls.
// ─────────────────────────────────────────────────────────────────────────────

/** Single-item success response */
export interface ApiResponse<T> {
  status: "success";
  data: T;
}

/** Paginated list response */
export interface ApiListResponse<T> {
  status: "success";
  results: number;
  page: number;
  totalPages: number;
  data: T[];
}

/** Error response */
export interface ApiErrorResponse {
  status: "fail" | "error";
  message: string;
  /** Field-level validation errors, keyed by field name */
  errors?: Record<string, string>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Common query params shared between frontend service calls and backend handlers
// ─────────────────────────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ActivityFilterParams extends PaginationParams {
  category?: string;
  city?: string;
  ageMin?: number;
  ageMax?: number;
  priceMin?: number;
  priceMax?: number;
  isOnline?: boolean;
  search?: string;
}
