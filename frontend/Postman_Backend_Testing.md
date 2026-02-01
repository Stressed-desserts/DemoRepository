# Postman Testing Guide for Urban Lease Backend

This guide provides example requests for testing the backend API using Postman.

---

## Base URL
```
http://localhost:8080/api
```

---

## 1. Authentication

### Signup
- **Endpoint:** `POST /auth/signup`
- **Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword",
  "role": "CUSTOMER" // or "OWNER" or "ADMIN"
}
```
- **Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "CUSTOMER"
}
```

### Login
- **Endpoint:** `POST /auth/login`
- **Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```
- **Response:**
```json
{
  "token": "<JWT_TOKEN>",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  }
}
```

---

## 2. User Profile

### Get Current User
- **Endpoint:** `GET /users/me?email=<user_email>`
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "CUSTOMER"
}
```

### Update Current User
- **Endpoint:** `PUT /users/me?email=<user_email>`
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Body (JSON):**
```json
{
  "name": "Jane Doe",
  "password": "newpassword"
}
```
- **Response:**
```json
{
  "id": 1,
  "name": "Jane Doe",
  "email": "john@example.com",
  "role": "CUSTOMER"
}
```

---

## 3. Properties

### Get All Verified Properties
- **Endpoint:** `GET /properties`
- **Response:**
```json
[
  {
    "id": 1,
    "title": "Office Space",
    "description": "Spacious office in city center",
    "price": 50000,
    "type": "OFFICE",
    "location": "Pune",
    "area": 1200,
    "verified": true,
    "ownerEmail": "owner@example.com"
  }
]
```

### Get Property by ID
- **Endpoint:** `GET /properties/{id}`
- **Response:**
```json
{
  "id": 1,
  "title": "Office Space",
  "description": "Spacious office in city center",
  "price": 50000,
  "type": "OFFICE",
  "location": "Pune",
  "area": 1200,
  "verified": true,
  "ownerEmail": "owner@example.com"
}
```

### Create New Property (OWNER only)
- **Endpoint:** `POST /properties`
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Body (JSON):**
```json
{
  "title": "Shop for Rent",
  "description": "Prime location retail shop",
  "price": 30000,
  "type": "SHOP", // Allowed: "OFFICE", "SHOP", "WAREHOUSE", "LAND"
  "location": "Mumbai",
  "area": 800
}
```
- **Response:**
```json
{
  "id": 2,
  "title": "Shop for Rent",
  "description": "Prime location retail shop",
  "price": 30000,
  "type": "SHOP",
  "location": "Mumbai",
  "area": 800,
  "verified": false,
  "ownerEmail": "owner@example.com"
}
```

---

## 4. Admin Endpoints

### Get All Properties (ADMIN only)
- **Endpoint:** `GET /admin/properties`
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>` (must be an ADMIN user)
- **Response:**
```json
[
  {
    "id": 1,
    "title": "Office Space",
    "description": "Spacious office in city center",
    "price": 50000,
    "type": "OFFICE",
    "location": "Pune",
    "area": 1200,
    "verified": true,
    "ownerEmail": "owner@example.com"
  },
  // ... more properties
]
```

---

## Notes
- All endpoints (except `/auth/signup` and `/auth/login` and `GET /properties`, `GET /properties/{id}`) require a valid JWT in the `Authorization` header.
- Use the JWT token returned from login for authenticated requests.
- Enum values:
  - **User Role:** `ADMIN`, `OWNER`, `CUSTOMER`
  - **Property Type:** `OFFICE`, `SHOP`, `WAREHOUSE`, `LAND`
- For error responses, check the `message` field in the response body. 