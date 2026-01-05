# API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
This API uses Bearer Token authentication. Include the token in the Authorization header:
```
Authorization: Bearer {your_token}
```

---

## Authentication Endpoints

### 1. Register User

**Endpoint:** `POST /signup`

**Description:** Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-01-05T10:00:00.000000Z",
    "updated_at": "2026-01-05T10:00:00.000000Z"
  },
  "token": "1|abc123def456..."
}
```

**Validation Rules:**
- `name`: required, string, max:255
- `email`: required, email, unique:users
- `password`: required, min:8, confirmed

---

### 2. Login

**Endpoint:** `POST /login`

**Description:** Login with existing credentials

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-01-05T10:00:00.000000Z",
    "updated_at": "2026-01-05T10:00:00.000000Z"
  },
  "token": "2|xyz789abc123..."
}
```

**Error Response:** `422 Unprocessable Entity`
```json
{
  "message": "Provided email or password is incorrect"
}
```

**Validation Rules:**
- `email`: required, email
- `password`: required

---

### 3. Logout

**Endpoint:** `POST /logout`

**Description:** Logout the authenticated user

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `204 No Content`

---

### 4. Get Current User

**Endpoint:** `GET /user`

**Description:** Get the currently authenticated user's information

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2026-01-05T10:00:00.000000Z",
  "updated_at": "2026-01-05T10:00:00.000000Z"
}
```

---

## User Management Endpoints (Protected)

All user management endpoints require authentication.

### 5. Get All Users

**Endpoint:** `GET /users`

**Description:** Get paginated list of all users

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 10)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2026-01-05T10:00:00.000000Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "created_at": "2026-01-05T11:00:00.000000Z"
    }
  ],
  "links": {
    "first": "http://localhost:8000/api/users?page=1",
    "last": "http://localhost:8000/api/users?page=5",
    "prev": null,
    "next": "http://localhost:8000/api/users?page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 5,
    "per_page": 10,
    "to": 10,
    "total": 50
  }
}
```

---

### 6. Get Single User

**Endpoint:** `GET /users/{id}`

**Description:** Get a specific user by ID

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-01-05T10:00:00.000000Z"
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "message": "Resource not found."
}
```

---

### 7. Create User

**Endpoint:** `POST /users`

**Description:** Create a new user

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securepass123"
}
```

**Response:** `201 Created`
```json
{
  "data": {
    "id": 3,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "created_at": "2026-01-05T12:00:00.000000Z"
  }
}
```

**Validation Rules:**
- `name`: required, string, max:255
- `email`: required, email, unique:users
- `password`: required, min:8

---

### 8. Update User

**Endpoint:** `PUT /users/{id}`

**Description:** Update an existing user

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "newpassword123"
}
```

**Note:** Password is optional. If not provided, it won't be updated.

**Response:** `200 OK`
```json
{
  "data": {
    "id": 3,
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "created_at": "2026-01-05T12:00:00.000000Z",
    "updated_at": "2026-01-05T13:00:00.000000Z"
  }
}
```

**Validation Rules:**
- `name`: sometimes, string, max:255
- `email`: sometimes, email, unique:users,{id}
- `password`: sometimes, min:8

---

### 9. Delete User

**Endpoint:** `DELETE /users/{id}`

**Description:** Delete a user

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `204 No Content`

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "message": "Resource not found."
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthenticated."
}
```

### 422 Validation Error
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "email": [
      "The email has already been taken."
    ],
    "password": [
      "The password must be at least 8 characters."
    ]
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found."
}
```

### 405 Method Not Allowed
```json
{
  "success": false,
  "message": "Method not allowed."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An error occurred while processing your request."
}
```

---

## Rate Limiting

API requests are limited to 60 requests per minute per user/IP address.

**Rate Limit Headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1609459200
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:8000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Users (with auth)
```bash
curl -X GET http://localhost:8000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Postman Collection

Import the following URL to get started with Postman:
```
[Add your Postman collection link here]
```
