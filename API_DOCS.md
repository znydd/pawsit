# PawSit API Documentation

Base URL: `http://localhost:3000/api`

All endpoints (except `/health`) require authentication via Bearer token.

---

## Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check API status |

**Response:**
```json
{ "status": "ok" }
```

---

## Owner Endpoints

Base: `/api/owners`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get owner profile |
| POST | `/profile` | Create owner profile |
| PATCH | `/profile` | Update owner profile |

### POST /profile - Create Owner

```json
{
  "displayName": "John Doe",
  "displayImage": "https://example.com/avatar.jpg",
  "phoneNumber": "+8801712345678",
  "bio": "Pet lover looking for reliable sitters",
  "address": "123 Pet Street, Dhaka",
  "area": "Gulshan",
  "location": { "x": 90.4125, "y": 23.7925 }
}
```

### PATCH /profile - Update Owner

```json
{
  "displayName": "John Updated",
  "bio": "Updated bio",
  "phoneNumber": "+8801798765432"
}
```

---

## Sitter Endpoints

Base: `/api/sitters`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get sitter profile |
| POST | `/profile` | Create sitter profile |
| PATCH | `/profile` | Update sitter profile |
| GET | `/services` | Get sitter services |
| PATCH | `/services` | Update sitter service |
| PATCH | `/availability` | Update availability status |
| GET | `/search` | Search sitters by location radius |
| GET | `/manual-search` | Search sitters by area name |
| GET | `/photos` | Get sitter photos |
| POST | `/photos` | Upload sitter photo |

### POST /profile - Create Sitter

```json
{
  "displayName": "Jane Sitter",
  "displayImage": "https://example.com/avatar.jpg",
  "phoneNumber": "+8801812345678",
  "headline": "Experienced Pet Sitter",
  "bio": "5 years of pet care experience",
  "address": "456 Sitter Lane, Dhaka",
  "area": "Banani",
  "location": { "x": 90.4050, "y": 23.7940 },
  "experienceYears": 5,
  "acceptsLargeDogs": true,
  "acceptsSmallDogs": true,
  "acceptsCats": true,
  "acceptsFish": false,
  "acceptsBirds": true,
  "acceptsOtherPets": false,
  "nidImage": "https://example.com/nid.jpg"
}
```

### PATCH /services - Update Service

```json
{
  "serviceType": "house_sitting",
  "pricePerDay": 150,
  "isActive": true
}
```

### PATCH /availability

```json
{ "isAvailable": true }
```

### GET /search - Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| lat | number | Latitude |
| lng | number | Longitude |
| radius | number | Search radius in km |

Example: `/search?lat=23.7925&lng=90.4125&radius=5`

### GET /manual-search - Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| area | string | Area name to search |

Example: `/manual-search?area=Banani`

### POST /photos - Upload Photo

```json
{
  "imageUrl": "https://example.com/photo.jpg",
  "photoType": "environment",
  "caption": "My backyard"
}
```

---

## Booking Endpoints

Base: `/api/bookings`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create booking request (owner) |
| GET | `/owner` | Get owner's bookings |
| GET | `/sitter` | Get sitter's bookings |
| PATCH | `/:id/accept` | Accept booking (sitter) |
| DELETE | `/:id` | Cancel/delete booking |
| POST | `/:id/chat` | Initialize chat channel |

### POST / - Create Booking

```json
{
  "sitterId": 1,
  "serviceId": 1,
  "totalPrice": 450.00,
  "specialRequest": "Please give extra attention to my cat"
}
```

---

## Review Endpoints

Base: `/api/reviews`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Submit review (owner) |
| GET | `/sitter` | Get reviews for sitter |
| PATCH | `/:id/reply` | Reply to review (sitter) |

### POST / - Submit Review

```json
{
  "bookingId": 1,
  "rating": 5,
  "reviewText": "Amazing sitter! Highly recommend!"
}
```

### PATCH /:id/reply - Sitter Reply

```json
{
  "sitterResponse": "Thank you for the kind words!"
}
```

---

## Notification Endpoints

Base: `/api/notifications`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all notifications |
| PATCH | `/:id/read` | Mark notification as read |
| PATCH | `/read-all` | Mark all as read |
| DELETE | `/` | Clear all notifications |

---

## Chat Endpoints

Base: `/api/chat`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/token` | Get Stream Chat token |

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Upload Endpoints

Base: `/api/upload`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/image` | Upload image (multipart/form-data) |

**Form Data:**
- `file`: Image file

**Response:**
```json
{
  "success": true,
  "url": "https://uploaded-image-url.com/image.jpg"
}
```

---

## User Endpoints

Base: `/api/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| DELETE | `/delete-account` | Delete user account |

> ⚠️ **Warning:** This permanently deletes the user and all associated data.

---

## Authentication

All protected endpoints require the `Authorization` header:

```
Authorization: Bearer <session_token>
```

Get your token from browser cookies: `better-auth.session_token`

---

## Standard Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```
