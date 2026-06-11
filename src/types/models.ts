// ─────────────────────────────────────────────────────────────────────────────
// Client-side models
// ─────────────────────────────────────────────────────────────────────────────
import {
  ActivityCategory,
  BookingStatus,
  ParticipantType,
  PaymentStatus,
  StripeAccountStatus,
} from "./enums";

// ── Client ───────────────────────────────────────────────────────────────────

export interface Client {
  id: string;
  auth0Id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string; // ISO 8601 — serialised as string over HTTP
  updatedAt: string;
}

/** Shape returned when creating or updating a client */
export interface CreateClientDto {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
}

export type UpdateClientDto = Partial<CreateClientDto>;

// ── Child ────────────────────────────────────────────────────────────────────

export interface Child {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO 8601
  allergies: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChildDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO 8601
  allergies?: string;
  notes?: string;
}

export type UpdateChildDto = Partial<CreateChildDto>;

// ─────────────────────────────────────────────────────────────────────────────
// Provider-side models
// ─────────────────────────────────────────────────────────────────────────────

// ── Provider ─────────────────────────────────────────────────────────────────

export interface Provider {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Stripe Connect
  stripeAccountId: string | null;
  stripeAccountStatus: StripeAccountStatus;
  stripeChargesEnabled: boolean;
  stripePayoutsEnabled: boolean;
  stripeOnboardedAt: string | null;
  platformFeePercent: number;
}

export interface CreateProviderDto {
  name: string;
  description?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  logoUrl?: string;
}

export type UpdateProviderDto = Partial<CreateProviderDto>;

// ── ProviderAdmin ─────────────────────────────────────────────────────────────

export interface ProviderAdmin {
  id: string;
  auth0Id: string;
  email: string;
  firstName: string;
  lastName: string;
  providerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProviderAdminDto {
  email: string;
  firstName: string;
  lastName: string;
  providerId: string;
}

export type UpdateProviderAdminDto = Partial<
  Omit<CreateProviderAdminDto, "providerId">
>;

// ── Teacher ───────────────────────────────────────────────────────────────────

export interface Teacher {
  id: string;
  auth0Id: string | null;
  email: string | null;
  providerId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  bio: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherDto {
  email?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
}

export type UpdateTeacherDto = Partial<CreateTeacherDto>;

// ─────────────────────────────────────────────────────────────────────────────
// Activity domain models
// ─────────────────────────────────────────────────────────────────────────────

// ── Activity ──────────────────────────────────────────────────────────────────

export interface Activity {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: ActivityCategory;
  ageMin: number | null;
  ageMax: number | null;
  price: number;
  currency: string;
  duration: number; // minutes
  maxCapacity: number;
  location: string | null;
  isOnline: boolean;
  isActive: boolean;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  // Optional relations (included when fetched with relations)
  provider?: Pick<Provider, "id" | "name" | "logoUrl">;
  teachers?: TeacherSummary[];
  sessions?: Session[];
}

export interface CreateActivityDto {
  title: string;
  description: string;
  category: ActivityCategory;
  ageMin?: number;
  ageMax?: number;
  price: number;
  currency?: string;
  duration: number;
  maxCapacity: number;
  location?: string;
  isOnline?: boolean;
  imageUrl?: string;
  teacherIds?: string[];
}

export type UpdateActivityDto = Partial<CreateActivityDto>;

// Lean summary used in lists and nested relations
export interface ActivitySummary {
  id: string;
  title: string;
  category: ActivityCategory;
  price: number;
  currency: string;
  imageUrl: string | null;
  provider: Pick<Provider, "id" | "name" | "logoUrl">;
}

// ── Session ───────────────────────────────────────────────────────────────────

export interface Session {
  id: string;
  activityId: string;
  startTime: string; // ISO 8601
  endTime: string;
  capacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionDto {
  startTime: string; // ISO 8601
  endTime: string;
  capacity: number;
}

export type UpdateSessionDto = Partial<CreateSessionDto>;

// ── Teacher (summary view) ────────────────────────────────────────────────────

export interface TeacherSummary {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  bio: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Booking domain models
// ─────────────────────────────────────────────────────────────────────────────

// ── Booking ───────────────────────────────────────────────────────────────────

export interface Booking {
  id: string;
  clientId: string;
  activityId: string;
  sessionId: string | null;
  participantType: ParticipantType;
  participantChildId: string | null;
  status: BookingStatus;
  totalAmount: number;
  currency: string;
  notes: string | null;
  invoiceUrl: string | null;
  createdAt: string;
  updatedAt: string;
  // Optional relations
  activity?: ActivitySummary;
  session?: Session;
  participantChild?: Pick<Child, "id" | "firstName" | "lastName">;
  payment?: Payment;
}

export interface CreateBookingDto {
  activityId: string;
  sessionId?: string;
  participantType: ParticipantType;
  participantChildId?: string; // required when participantType = CHILD
  notes?: string;
}

// ── Payment ───────────────────────────────────────────────────────────────────

export interface Payment {
  id: string;
  bookingId: string;
  stripePaymentIntentId: string | null;
  stripeChargeId: string | null;
  stripeTransferId: string | null;
  amount: number;
  platformFee: number;
  providerAmount: number;
  currency: string;
  status: PaymentStatus;
  method: string | null;
  last4: string | null;
  receiptUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
