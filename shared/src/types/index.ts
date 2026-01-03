import type {
    petSitterTable,
    serviceTable,
    sitterAvailabilityTable,
    sitterPhotoTable,
    petOwnerTable,
    petImageTable,
    bookingTable,
    paymentTable,
    reviewTable,
    reportTable,
    notificationTable
} from "../db/schema";

import type {
    user,
    session,
    account,
    verification
} from "../db/auth.schema";

// ============================================================================
// Auth Types
// ============================================================================

// User
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

// Session
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

// Account
export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;

// Verification
export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;

// ============================================================================
// Domain Types
// ============================================================================

// PetSitter
export type PetSitter = typeof petSitterTable.$inferSelect;
export type NewPetSitter = typeof petSitterTable.$inferInsert;

// Service
export type Service = typeof serviceTable.$inferSelect;
export type NewService = typeof serviceTable.$inferInsert;

// SitterAvailability
export type SitterAvailability = typeof sitterAvailabilityTable.$inferSelect;
export type NewSitterAvailability = typeof sitterAvailabilityTable.$inferInsert;

// SitterPhoto
export type SitterPhoto = typeof sitterPhotoTable.$inferSelect;
export type NewSitterPhoto = typeof sitterPhotoTable.$inferInsert;

// PetOwner
export type PetOwner = typeof petOwnerTable.$inferSelect;
export type NewPetOwner = typeof petOwnerTable.$inferInsert;

// PetImage
export type PetImage = typeof petImageTable.$inferSelect;
export type NewPetImage = typeof petImageTable.$inferInsert;

// Booking
export type Booking = typeof bookingTable.$inferSelect;
export type NewBooking = typeof bookingTable.$inferInsert;

// Payment
export type Payment = typeof paymentTable.$inferSelect;
export type NewPayment = typeof paymentTable.$inferInsert;

// Review
export type Review = typeof reviewTable.$inferSelect;
export type NewReview = typeof reviewTable.$inferInsert;

// Report
export type Report = typeof reportTable.$inferSelect;
export type NewReport = typeof reportTable.$inferInsert;

// Notification
export type Notification = typeof notificationTable.$inferSelect;
export type NewNotification = typeof notificationTable.$inferInsert;

// ============================================================================
// Search Types
// ============================================================================

// Manual Search Params
export type ManualSearchParams = {
    area: string;
};