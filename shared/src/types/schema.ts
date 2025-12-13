// Inferred types from Drizzle schema
// These are manually defined to avoid importing drizzle in shared package

// ============ User ============
export type User = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
} | null;

export type Session = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined;
    userAgent?: string | null | undefined;
} | null;

export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;


// ============ Pet Sitter ============
export type PetSitter = {
    id: number;
    userId: string;
    displayName: string | null;
    displayImage: string | null;
    phoneNumber: string;
    headline: string;
    bio: string | null;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    experienceYears: number;
    acceptsLargeDogs: boolean;
    acceptsSmallDogs: boolean;
    acceptsCats: boolean;
    acceptsFish: boolean;
    acceptsBirds: boolean;
    acceptsOtherPets: boolean;
    nidImage: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    averageRating: number;
    totalReviews: number;
};

export type NewPetSitter = Omit<PetSitter, 'id' | 'createdAt' | 'updatedAt'>;

// ============ Pet Owner ============
export type PetOwner = {
    id: number;
    userId: string;
    displayName: string | null;
    displayImage: string | null;
    phoneNumber: string;
    bio: string | null;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    isSitter: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type NewPetOwner = Omit<PetOwner, 'id' | 'createdAt' | 'updatedAt'>;

// ============ Service ============
export type Service = {
    id: number;
    sitterId: number;
    name: string;
    serviceType: string;
    description: string;
    pricePerDay: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type NewService = Omit<Service, 'id' | 'createdAt' | 'updatedAt'>;

// ============ Booking ============
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export type Booking = {
    id: number;
    sitterId: number;
    ownerId: number;
    serviceId: number;
    startDate: Date;
    endDate: Date;
    status: string;
    totalPrice: number;
    specialRequest: string | null;
    bookingCode: string;
    createdAt: Date;
    updatedAt: Date;
};

export type NewBooking = Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'bookingCode'>;

// ============ Review ============
export type Review = {
    id: number;
    bookingId: number;
    sitterId: number;
    ownerId: number;
    rating: number;
    reviewText: string | null;
    sitterResponse: string | null;
    repliedAt: Date | null;
    isFalse: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type NewReview = Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'sitterResponse' | 'repliedAt'>;

// ============ Payment ============
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type Payment = {
    id: number;
    bookingId: number;
    amount: number;
    paymentMethod: string;
    paymentStatus: string;
    transactionId: string;
    paidAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

// ============ Notification ============
export type Notification = {
    id: number;
    userId: number;
    type: string;
    content: string;
    sendToEmail: boolean;
    sendToPhone: boolean;
    createdAt: Date;
    updatedAt: Date;
};
