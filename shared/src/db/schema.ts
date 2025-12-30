import { user } from "./auth.schema";
import { 
    pgTable,
    text,
    timestamp,
    boolean,
    index,
    integer,
    doublePrecision,
    varchar,
    geometry
} from "drizzle-orm/pg-core";

export const petSitterTable = pgTable("pet_sitter", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id").notNull().references(() => user.id),
    displayName: varchar("display_name"),
    displayImage: varchar("display_image"),
    phoneNumber: text("phone_number").notNull(),
    headline: varchar("headline").notNull(),
    bio: varchar("bio"),
    address: varchar("address").notNull(),
    city: varchar("city").notNull(),
    location: geometry("location", {type: "Point", mode: "xy", srid: 4326}).notNull(),
    experienceYears: integer("experience_years").default(0).notNull(),
    acceptsLargeDogs: boolean("accepts_large_dogs").default(false).notNull(),
    acceptsSmallDogs: boolean("accepts_small_dogs").default(false).notNull(),
    acceptsCats: boolean("accepts_cats").default(false).notNull(),
    acceptsFish: boolean("accepts_fish").default(false).notNull(),
    acceptsBirds: boolean("accepts_birds").default(false).notNull(),
    acceptsOtherPets: boolean("accepts_other_pets").default(false).notNull(),
    nidImage: varchar("nid_image").notNull(),
    verified: boolean("verified").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    averageRating: doublePrecision("average_rating").default(0).notNull(),
    totalReviews: integer("total_reviews").default(0).notNull(),
}, (table) => [
    index("pet_sitter_userId_idx").on(table.userId),
    index("pet_sitter_location_idx").using("gist", table.location),
]);

export const serviceTable = pgTable("service", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    sitterId: integer("sitter_id").notNull().references(() => petSitterTable.id),
    serviceType: varchar("service_type").notNull(),
    pricePerDay: doublePrecision("price_per_day").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const sitterAvailabilityTable = pgTable("sitter_availability", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    sitterId: integer("sitter_id").notNull().references(() => petSitterTable.id),
    isAvailable: boolean("is_available").default(true).notNull(),
    isBanned: boolean("is_banned").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const sitterPhotoTable = pgTable("sitter_photo", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    sitterId: integer("sitter_id").notNull().references(() => petSitterTable.id),
    imageUrl: varchar("image_url").notNull(),
    photoType: varchar("photo_type").notNull(),
    caption: varchar("caption"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const petOwnerTable = pgTable("pet_owner", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id").notNull().references(() => user.id),
    displayName: varchar("display_name").notNull(),
    displayImage: varchar("display_image").notNull(),
    phoneNumber: text("phone_number"),
    bio: varchar("bio"),
    address: varchar("address"),
    city: varchar("city"),
    location: geometry("location", {type: "Point", mode: "xy", srid: 4326}).notNull(),
    isSitter: boolean("is_sitter").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
}, (table) => [
    index("pet_owner_userId_idx").on(table.userId),
]);

export const petImageTable = pgTable("pet_image", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    ownerId: integer("owner_id").notNull().references(() => petOwnerTable.id),
    imageUrl: varchar("image_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const bookingTable = pgTable("booking", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    sitterId: integer("sitter_id").notNull().references(() => petSitterTable.id),
    ownerId: integer("owner_id").notNull().references(() => petOwnerTable.id),
    serviceId: integer("service_id").notNull().references(() => serviceTable.id),
    isAccepted: boolean("is_accepted").default(false).notNull(),
    totalPrice: doublePrecision("total_price").notNull(),
    specialRequest: varchar("special_request"),
    bookingCode: varchar("booking_code").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
}, (table) => [
    index("booking_sitterId_idx").on(table.sitterId),
    index("booking_ownerId_idx").on(table.ownerId),
]);

export const paymentTable = pgTable("payment", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    bookingId: integer("booking_id").notNull().references(() => bookingTable.id),
    amount: doublePrecision("amount").notNull(),
    paymentMethod: varchar("payment_method").notNull(),
    paymentStatus: varchar("payment_status").notNull().default("pending"),
    transactionId: varchar("transaction_id").notNull(),
    paidAt: timestamp("paid_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const reviewTable = pgTable("review", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    bookingId: integer("booking_id").notNull().references(() => bookingTable.id),
    sitterId: integer("sitter_id").notNull().references(() => petSitterTable.id),
    ownerId: integer("owner_id").notNull().references(() => petOwnerTable.id),
    rating: integer("rating").notNull(),
    reviewText: varchar("review_text"),
    sitterResponse: varchar("sitter_response"),
    repliedAt: timestamp("replied_at"),
    isFalse: boolean("is_false").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});


export const reportTable = pgTable("report", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    reporterId: text("reporter_id").notNull().references(() => user.id),
    reporteeId: text("reportee_id").notNull().references(() => user.id),
    reportType: varchar("report_type").notNull(),
    description: varchar("description").notNull(),
    status: varchar("status").notNull().default("pending"),
    adminResponse: varchar("admin_response"),
    resolvedAt: timestamp("resolved_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const notificationTable = pgTable("notification", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id").notNull().references(() => user.id),
    type: varchar("type").notNull(),
    content: varchar("content").notNull(),
    sendToEmail: boolean("send_to_email").default(true).notNull(),
    sendToPhone: boolean("send_to_phone").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});
