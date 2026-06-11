// ─────────────────────────────────────────────────────────────────────────────
// Enums — mirror of prisma/schema.prisma enums.
// Single source of truth shared by frontend and backend.
// ─────────────────────────────────────────────────────────────────────────────

export enum ParticipantType {
  SELF = 'SELF',
  CHILD = 'CHILD',
}

export enum ActivityCategory {
  SPORTS = 'SPORTS',
  ARTS_AND_CRAFTS = 'ARTS_AND_CRAFTS',
  MUSIC = 'MUSIC',
  DANCE = 'DANCE',
  STEM = 'STEM',
  LANGUAGE = 'LANGUAGE',
  TUTORING = 'TUTORING',
  OUTDOOR = 'OUTDOOR',
  SWIMMING = 'SWIMMING',
  MARTIAL_ARTS = 'MARTIAL_ARTS',
  OTHER = 'OTHER',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum StripeAccountStatus {
  NOT_CONNECTED = 'NOT_CONNECTED',
  ONBOARDING = 'ONBOARDING',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ACTIVE = 'ACTIVE',
  RESTRICTED = 'RESTRICTED',
  DISABLED = 'DISABLED',
}
